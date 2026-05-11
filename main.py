__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory

# 1. Initialize FastAPI
app = FastAPI(title="Voxii Master Expert Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://llm-math-education.vercel.app"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# 2. Initialize Expert Brain (ChromaDB)
# Note: Ensure you have run expert_expansion.py and update_brain.py locally first
vector_db = Chroma(
    persist_directory="./vcaa_json_index", 
    embedding_function=OpenAIEmbeddings()
)

# Lower temperature (0.2) keeps the AI strictly on the "Master Pedagogue" path
llm = ChatOpenAI(model_name="gpt-4o", temperature=0.2)

# 3. Memory Store for Session History
history_store = {}

def get_session_history(session_id: str):
    if session_id not in history_store:
        history_store[session_id] = ChatMessageHistory()
    return history_store[session_id]

# 4. Data Models
class ChatRequest(BaseModel):
    session_id: str
    message: str
    year_level: str
    subject: str

# 5. Root Health Check
@app.get("/")
async def root():
    return {
        "status": "Voxii Master Expert Backend Online",
        "tier": "Master (Multi-Query + CoT + Strict LaTeX + Imagery)",
        "database_synced": os.path.exists("./vcaa_json_index")
    }

# 6. The Expert Chat Endpoint
@app.post("/chat")
async def chat(request: ChatRequest):
    history = get_session_history(request.session_id)
    
    # --- SUBJECT & YEAR NORMALIZATION ---
    sub_map = {"maths": "Mathematics", "mathematics": "Mathematics", "science": "Science", "english": "English"}
    clean_sub = sub_map.get(request.subject.strip().lower(), request.subject.strip().capitalize())
    clean_year = request.year_level.strip().title()
    
    # --- STEP 1: MULTI-QUERY RETRIEVAL ---
    # Turns 1 vague question into 3 high-quality curriculum searches
    search_gen_prompt = f"Convert this student query into 3 distinct, technical search terms for a VCAA curriculum database: {request.message}"
    queries_response = llm.invoke(search_gen_prompt)
    search_queries = queries_response.content.split("\n")
    
    all_docs = []
    for q in search_queries:
        docs = vector_db.similarity_search(
            q, k=3, 
            filter={"$and": [{"year_level": clean_year}, {"subject": clean_sub}]}
        )
        all_docs.extend(docs)
    
    # Deduplicate retrieved documents
    unique_docs = {doc.page_content for doc in all_docs}
    context_text = "\n\n".join(unique_docs)

    # --- STEP 2: THE MASTER TUTOR SYSTEM PROMPT ---
    template = f"""You are a Master VCAA {clean_year} {clean_sub} Tutor. 
    You are an expert in the 'Zone of Proximal Development' and Socratic questioning.

    INTERNAL REASONING PROTOCOL (Perform this before responding):
    1. ASSESSMENT: Determine if the student is a Novice, Intermediate, or Advanced learner.
    2. STRATEGY: Select a specific analogy or scaffolding question from the provided Expert Guide.
    3. CHALLENGE: Provide a response that guides them toward the answer without giving it away.

    STRICT FORMATTING PROTOCOL (MANDATORY):
    - MATHEMATICS: You MUST use LaTeX for ALL numbers, variables, and equations.
        * Wrap ALL numbers in dollar signs (e.g., "$3$" and "$4$").
        * Wrap inline variables in dollar signs (e.g., "$x$").
        * Use $$display$$ for standalone formulas (e.g., "$$a^2 + b^2 = c^2$$").
        * Ensure fractions use \\frac{{}}{{}} (e.g., "$$\\frac{{1}}{{2}}$$").
    - IMAGERY: On a new line, insert the tag [Image of description] if a visual would help explain the concept.
    - SCANNABILITY: Use bolding and bullet points for clarity.

    STRICT BOUNDARIES:
    - Never provide the full answer or solution.
    - Use