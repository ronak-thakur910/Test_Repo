from flask import Flask, request
from googlesearch import search
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
    
app = Flask(__name__)
    
def Worker(UserMessage):   
    from langchain_community.document_loaders import UnstructuredURLLoader
    ListenAll = list(search(UserMessage, num=15, stop=15, pause=1))
    TrustIssue = ["tradingview.com", "moneycontrol.com", "groww.in", "angelone.in", "dhan.co", "nse", "screener.in"]
    Listen = [word for word in ListenAll if any(keyword in word for keyword in TrustIssue)]

    loader = UnstructuredURLLoader(urls=Listen)
    data = loader.load()
    print(data)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000)
    docs = text_splitter.split_documents(data)
    print(docs)
    
    print("Total number of documents: ",len(docs))
    
    from langchain_chroma import Chroma
    from dotenv import load_dotenv
    load_dotenv() 
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector = embeddings.embed_query("hello, world!")

    vectorstore = Chroma.from_documents(documents=docs, embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001"))
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 1})
    
    retrieved_docs = retriever.invoke("What is new in yolov9?")
    len(retrieved_docs)
    from langchain_google_genai import ChatGoogleGenerativeAI
    
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro",temperature=0.3, max_tokens=500)
    
    from langchain.chains import create_retrieval_chain
    from langchain.chains.combine_documents import create_stuff_documents_chain

    system_prompt = (
        "You are a financial assistant chatbot for question-answering tasks. "
        "Use the following pieces of retrieved context to answer the question."
        "Give Answer To User Queries Anyhow. Dont Give default error"
        "\n\n"
        "{context}"
    )
    
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )
    
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    try:
        response = rag_chain.invoke({"input": UserMessage})
    except RuntimeError as e:
        print("LangChain execution error:", e)

    return response

@app.route('/')
def home():
    global UserMessage
    UserMessage = request.args.get('msg')
    
    print(UserMessage)
    TrainBrain = Worker(UserMessage)
    ResponseD = str(TrainBrain["answer"])
    
    print(ResponseD)
    return ResponseD
    
if __name__ == '__main__':
    app.run(debug=True)
