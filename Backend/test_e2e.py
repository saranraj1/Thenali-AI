import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def print_step(step):
    print(f"\n{'='*50}\n> {step}\n{'='*50}")

def run_tests():
    # 1. Health
    print_step("Health Check")
    resp = requests.get("http://localhost:8000/health")
    print(resp.json())
    assert resp.status_code == 200

    # 2. Register
    print_step("Authentication (Register & Login)")
    timestamp = int(time.time())
    email = f"test_{timestamp}@example.com"
    resp = requests.post(f"{BASE_URL}/auth/register", json={
        "username": "Test User",
        "email": email,
        "password": "Password123!"
    })
    print(resp.json())
    assert resp.status_code == 201
    auth_token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}

    # 3. Avatar Upload
    print_step("Profile Storage Test (Avatar Upload)")
    files = {"file": ("avatar.jpg", b"fake_image_bytes", "image/jpeg")}
    resp = requests.post(f"{BASE_URL}/profile/avatar", files=files, headers=headers)
    print(resp.json())
    assert resp.status_code == 200

    # 4. Upload Repo
    print_step("Repository Intelligence (Upload)")
    resp = requests.post(f"{BASE_URL}/repos/upload", data={
        "repo_url": "https://github.com/octocat/Hello-World"
    }, headers=headers)
    print(resp.json())
    assert resp.status_code == 200
    repo_id = resp.json()["repo_id"]

    # 4.1 Wait for Status
    print_step("RAG Pipeline processing...")
    max_retries = 30
    status = "pending"
    for i in range(max_retries):
        time.sleep(2)
        resp = requests.get(f"{BASE_URL}/repos/status/{repo_id}", headers=headers)
        status = resp.json().get("status")
        print(f"Status: {status}")
        if status in ["analyzed", "error"]:
            break
    assert status == "analyzed"

    # 4.2 Get Intelligence
    print_step("Repository Intelligence (Result)")
    resp = requests.get(f"{BASE_URL}/repos/intelligence/{repo_id}", headers=headers)
    intel = resp.json()
    print(intel)
    assert resp.status_code == 200

    # 5. Repo Chat
    print_step("Repository Q&A (RAG)")
    resp = requests.post(f"{BASE_URL}/repos/chat", json={
        "repo_id": repo_id,
        "message": "What does this repo do?"
    }, headers=headers)
    print(resp.json())
    assert resp.status_code == 200

    # 6. Roadmap
    print_step("Learning System (Roadmap)")
    resp = requests.post(f"{BASE_URL}/learning/roadmap", json={
        "goal": "Learn React Hooks",
        "stack": ["React", "JavaScript"],
        "timeline": "2 weeks"
    }, headers=headers)
    rm = resp.json()
    print(rm)
    assert resp.status_code == 200

    # 7. Concept Module
    print_step("Learning System (Concept Module)")
    resp = requests.post(f"{BASE_URL}/learning/module", json={
        "topic": "useState hook"
    }, headers=headers)
    print(resp.json())
    assert resp.status_code == 200

    # 8. Assessment Start
    print_step("Assessment Engine (Start)")
    resp = requests.post(f"{BASE_URL}/assessment/start", json={
        "topic": "React Hooks",
        "num_questions": 2
    }, headers=headers)
    assess = resp.json()
    print(assess)
    assert resp.status_code == 200
    assess_id = assess["assessment_id"]
    q1_id = assess["questions"][0]["id"]
    q2_id = assess["questions"][1]["id"]

    # 9. Assessment Answer
    print_step("Assessment Engine (Answer)")
    resp = requests.post(f"{BASE_URL}/assessment/answer", json={
        "assessment_id": assess_id,
        "question_id": q1_id,
        "answer": "React hooks allow you to use state in functional components."
    }, headers=headers)
    print(resp.json())
    assert resp.status_code == 200
    
    resp = requests.post(f"{BASE_URL}/assessment/answer", json={
        "assessment_id": assess_id,
        "question_id": q2_id,
        "answer": "useContext and useReducer are also hooks."
    }, headers=headers)
    assert resp.status_code == 200

    # 10. Assessment Results
    print_step("Assessment Engine (Results)")
    resp = requests.get(f"{BASE_URL}/assessment/results/{assess_id}", headers=headers)
    print(resp.json())
    assert resp.status_code == 200

    # 11. Playground
    print_step("Playground Execution")
    resp = requests.post(f"{BASE_URL}/playground/run", json={
        "code": "print('Hello from Sandbox!')",
        "language": "python"
    }, headers=headers)
    print(resp.json())
    assert resp.status_code == 200

    # 12. Voice Speak
    print_step("Voice Module (Polly Speak)")
    resp = requests.post(f"{BASE_URL}/voice/speak", json={
        "text": "Hello, this is a voice test."
    }, headers=headers)
    print(resp.status_code, len(resp.content), "bytes")
    assert resp.status_code == 200

    # 13. Dashboard
    print_step("Dashboard Metrics")
    resp = requests.get(f"{BASE_URL}/dashboard", headers=headers)
    print(resp.json())
    assert resp.status_code == 200

    print_step("ALL TESTS PASSED SUCCESSFULLY.")

if __name__ == "__main__":
    run_tests()
