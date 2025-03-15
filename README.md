# Commerce Genesis

Commerce Genesis is an advanced eCommerce platform that successfully integrates generative AI tools with full-stack web technologies to enhance the shopping experience. This completed project combines AI-driven features with modern eCommerce functionality, delivering optimal performance and reliability.

![Banner](./assets/banner.avif)

## Contributors
- [Vivian Ludrick](https://github.com/vivalchemy)
- [Ronit Naik](https://github.com/RonitNaik122)
- [Saachi Kokate](https://github.com/SaachiK08)

## Project Showcase

This repository contains the complete codebase for Commerce Genesis, a next-generation eCommerce solution designed to demonstrate the powerful capabilities of AI integration in online retail. The platform is fully implemented and ready for demonstration purposes.

## Implemented Features

![Key Features](./assets/key_features.avif)

### Core Functionality
- ✅ **Generative AI Integration** - AI-powered product recommendations and content generation
- ✅ **Personalized Marketing** - Tailored product suggestions based on user behavior
- ✅ **User Authentication** - Secure login and user account management 
- ✅ **Shopping Cart & Order Management** - Seamless shopping and order tracking
- ✅ **Payment Gateway** - Integrated payment processing via Stripe
- ✅ **Chatbot for Customer Assistance** - AI-powered customer support
- ✅ **Dynamic Pricing & Data Analytics** - Intelligent pricing adjustments based on market trends

![Usp1](./assets/usp-1.avif)
![Usp2](./assets/usp-2.avif)

### Enhanced Capabilities
- ✅ **Augmented Reality (AR)** - Virtual product previews in real environments
- ✅ **Voice Assistance** - Voice-controlled shopping interface
- ✅ **Translation Services** - Multi-language support via Google Translation
- ✅ **Live Image Upload & Recommendation** - Visual search and product matching
- ✅ **AI-Generated Product Descriptions** - Automated content for seller listings
- ✅ **Review Summarization** - AI-powered condensation of product reviews
- ✅ **Stock Management** - Inventory tracking with "Hurry Fast" availability notices
- ✅ **Delivery Tracking** - Real-time shipment monitoring
- ✅ **Loyalty Points System** - Reward program for customer retention
- ✅ **Fake Product Detection** - Counterfeit identification system (YOLO)

## Technology Stack

![Technology Stack](./assets/tech_stack.avif)

### Frontend
- Next.js with TypeScript
- React components styled with Tailwind CSS
- Shadcn UI component library
- Responsive design optimized for all devices

### Backend
- Django REST framework for robust API endpoints
- SQLite database (configured for demonstration purposes)
- Trained machine learning models for dynamic pricing

### AR Integration
- Three.js and React WebXR implementation
- 3D product models in GLB/GLTF format

### Payment Processing
- Secure Stripe integration

### AI Components
- Gemini Chat integration for customer support
- Custom ML models for price optimization
- YOLO-based counterfeit detection system

## Project Structure

The repository is organized into focused modules:

```
commerce-genesis/
├── AR/                      # Augmented Reality implementation
├── backend/                 # Django REST API with ML models
├── frontend/                # Next.js application with UI components
├── gemini-chat/             # AI chatbot integration
├── stripe-payment/          # Payment processing service
└── extension/               # Browser extension companion
```

## Demonstration Setup

For showcase purposes, follow these steps to run a complete demo:

### Complete System Demo
1. Clone the repository
2. Start the backend service:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd MyBacke
   python manage.py runserver
   ```
3. Start the chatbot service:
   ```bash
   cd gemini-chat
   pip install -r requirements.txt
   python manage.py runserver
   ```
4. Launch the frontend application:
   ```bash
   cd frontend
   npm run build
   npm start
   ```
5. Initialize the AR component (optional):
   ```bash
   cd AR/Webxr-three-react-2/React-Webxr
   npm start
   ```
6. Load the chrome extension (optional):
Refer to [this](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) section of the tutorial to load the chrome extension

## Key Implementation Highlights

- **Multi-role System**: Supports customers, vendors, and administrators
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **AI Integration**: Seamless integration of multiple AI services
- **Security**: Comprehensive authentication and secure payment processing
- **Performance**: Optimized for fast page loads and responsive interactions

## License

This project is available for demonstration and educational purposes. Commercial use requires explicit permission.
