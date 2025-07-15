
# 📦 Event Management API

### 🔹 Get Event Details
```http
GET /events/:id
```
Returns event info + list of registered users

### 🔹 Register for Event
```http
POST /events/:id/register
```
```json
{
  "user_id": 1
}
```

### 🔹 Cancel Registration
```http
DELETE /events/:id/register
```
```json
{
  "user_id": 1
}
```

### 🔹 List Upcoming Events
```http
GET /events
```
Returns events sorted by date & location

### 🔹 Get Event Stats
```http
GET /events/:id/stats
```
Returns:
```json
{
  "total_registrations": 120,
  "remaining_capacity": 80,
  "percent_used": 60.00
}
```

---

## 🧪 Testing
Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test endpoints. 

You can also insert users manually:
```sql
INSERT INTO users (name, email) VALUES ('Ravi', 'ravi@example.com');
```

---

## 🛠 Tech Stack
- Node.js
- Express.js
- PostgreSQL
- pg module
- dotenv

---

## 📄 License
MIT — free to use for academic and learning purposes.

---

> Created with ❤️ by Deepak for Event Management Assignment
