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
from langchain_community.chat_message_histories import ChatMessageHistory

# 1. Initialize FastAPI
app = FastAPI(title="Voxii Master Expert Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://llm-math-education.vercel.app",
        "https://voxxi-yr9-maths-tutor.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
    ],
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

    # --- STEP 2: BUILD MESSAGES AND CALL LLM ---
    system_prompt = f"""You are a Master VCAA {clean_year} {clean_sub} Tutor.
You are an expert in the Zone of Proximal Development and Socratic questioning.

INTERNAL REASONING PROTOCOL:
1. ASSESSMENT: Determine if the student is a Novice, Intermediate, or Advanced learner.
2. STRATEGY: Select a specific analogy or scaffolding question from the Expert Guide below.
3. CHALLENGE: Guide them toward the answer without giving it away.

STRICT FORMATTING PROTOCOL (MANDATORY):
- MATHEMATICS: Use LaTeX for ALL numbers, variables, and equations.
  * Inline: $x$, $3$, $a^2 + b^2 = c^2$
  * Display: $$\\frac{{-b \\pm \\sqrt{{b^2 - 4ac}}}}{{2a}}$$
- IMAGERY: Insert [Image of <description>] on its own line when a visual would help.
- SCANNABILITY: Use bolding and bullet points for clarity.

STRICT BOUNDARIES:
- Never provide the full answer or solution directly.
- Use the Socratic method: ask guiding questions.
- Only discuss {clean_sub} topics relevant to the VCAA {clean_year} curriculum.

INTERACTIVE WIDGET PROTOCOL:
When appropriate, output a JSON code block to trigger an interactive widget. Use this EXACT format:
```json
{{"widget": "<WidgetName>", "data": {{ ... }}}}
```
Only output ONE widget block per response. You may include text before or after it.

Available widgets:

1. GraphWidget — Maths: graph/plot/visualize a function or equation.
   Example: {{"widget": "GraphWidget", "data": {{"equation": "y=x^{{2}}-5x+6", "label": "Quadratic"}}}}
   - equation: valid LaTeX (e.g. y=\\sin(x), y=2x+1, y=x^{{2}})

2. DataChartWidget — Science: show experiment results, comparisons, or data as a bar or line chart.
   Example: {{"widget": "DataChartWidget", "data": {{"title": "Boiling Points", "xLabel": "Substance", "yLabel": "Temp (°C)", "chartType": "bar", "data": [{{"name": "Water", "value": 100}}, {{"name": "Ethanol", "value": 78}}]}}}}
   - chartType: "bar" or "line"
   - data: array of {{"name": string, "value": number}}

3. AnnotatedTextWidget — English: highlight literary devices in a passage.
   Example: {{"widget": "AnnotatedTextWidget", "data": {{"title": "Metaphor & Simile", "text": "Life is a journey and she ran like the wind.", "annotations": [{{"word": "Life is a journey", "label": "Metaphor", "color": "blue"}}, {{"word": "like the wind", "label": "Simile", "color": "green"}}]}}}}
   - annotations: array of {{"word": string, "label": string, "color": "blue"|"green"|"yellow"|"pink"|"purple"|"orange"}}

EXPERT CURRICULUM GUIDE:
{context_text}"""

    messages = [{"role": "system", "content": system_prompt}]
    for msg in history.messages:
        role = "assistant" if msg.type == "ai" else "user"
        messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": request.message})

    result = llm.invoke(messages)
    response = result.content

    history.add_user_message(request.message)
    history.add_ai_message(response)

    return {"response": response}