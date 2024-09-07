# 🎨 Zeno - Your Own Museum Companion

**Zeno** is your intelligent museum companion that enhances your museum experience through seamless ticket booking, skipping long queues, and providing personalized interaction with AI-powered chatbots. With multilingual support and integrated payments, Zeno helps both museum visitors and museum owners create smooth, engaging cultural experiences.

---

## 🚀 What Zeno Solves

1. **Skip the Queue**: No more standing in long lines! Zeno provides a fully digital ticketing experience so visitors can book tickets in advance or on the go.
   
2. **Human Error Reduction**: The manual ticketing system is prone to errors (double bookings, incorrect tickets, etc.). Zeno minimizes human error with its automated booking system.

3. **Multilingual Support**: Zeno caters to an international audience, providing support for multiple languages, ensuring no visitor is left behind.

4. **Data-Driven Insights**: Museums can access visitor analytics and payment insights to make informed decisions about operations and promotions.

5. **AI-Powered Chatbot**: A conversational chatbot to guide users through ticket booking, museum information, and more—without the need for human intervention.

---

## 🌟 Unique Selling Points (USP)

1. **AI-Powered Ticketing**: Zeno simplifies ticketing through an AI-driven chatbot that assists visitors in real-time with booking, payment, and museum information.
   
2. **Seamless Payment Gateway**: Integrated with payment gateways to offer fast, secure transactions that are directly tied to the booking system.

3. **Multilingual**: Serve visitors from across the globe with a system that supports multiple languages, making the museum experience accessible to everyone.

4. **Effortless Museum Management**: For museum owners, Zeno simplifies operations through automated ticket handling, real-time visitor data, and promotional opportunities.

5. **Personalized Experience**: Visitors can interact with the chatbot for personalized experiences, learning more about exhibits, museum hours, or even recommendations based on their preferences.

---

## 🛠️ Running the Project

### 1. **Clone the Repository**

```bash
git clone https://github.com/krishkalaria12/zeno-museum-companion.git
```

### 2. **Install Dependencies**

Navigate to the project folder and run:

```bash
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
MONGODB_URL="mongodb_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
WEBHOOK_SECRET="your_webhook_secret"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding
```

### 4. **Start the Development Server**

Run the following command to start the local development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Important Details

### **Core Features**:
- **AI-Powered Chatbot**: Automates museum visitor interaction, making booking easier.
- **Multilingual Support**: Accessible to visitors from all around the world.
- **Integrated Payments**: Built-in payment system to avoid manual handling.
- **Data Insights for Museums**: Helps museums optimize their visitor engagement and ticketing operations.

### **Tech Stack**:
- **Next.js**: A powerful React framework for server-side rendering and building dynamic web applications.
- **MongoDB**: NoSQL database to store ticket booking details, user data, and other essential information.
- **Clerk**: Handles user authentication, providing a secure and streamlined sign-in/sign-up experience.
- **Svix**: Webhooks for secure and efficient communication between Zeno and other services.

---

## 🏛️ How Zeno Enhances Your Cultural Experience

Zeno takes care of everything from booking tickets to ensuring a smooth payment experience, so you can focus on enjoying your visit to the museum. With Zeno, museum-goers can explore art and culture with less hassle, and museums can operate efficiently without worrying about administrative challenges.