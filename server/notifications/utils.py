import requests
import json

def send_message(to, conversation):
    url = "https://api.messaging.cw.co.ke/api/v1/clients/4cafbb0f-dd64-4f27-a6d9-86ca51d50a07/messages/sendMessage"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 22c74c65-fc3f-4ee0-8d65-fd2e80013034'
    }
    payload = json.dumps({
        "to": to,
        "conversation": conversation
    })

    try:
        response = requests.post(url, headers=headers, data=payload)
        
        if response.status_code == 200:
            return {"status": "success", "data": response.json()}
        else:
            return {"status": "error", "data": response.json(), "status_code": response.status_code}

    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": str(e)}
