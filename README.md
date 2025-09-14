# FASIFY - Travel Booking Platform

A modern, responsive travel booking platform built with React and Vite. FASIFY provides a comprehensive solution for booking hotels, car rentals, security services, and attractions all in one place.

## 🌟 Features

### 🏨 Hotel Reservations
- Advanced search and filtering system
- Price range filtering ($0 - $600)
- City-based filtering
- Guest and room selection
- Date range picker for check-in/check-out
- Responsive hotel cards with ratings and pricing

### 🚗 Car Rentals
- Vehicle booking system
- Multiple car categories
- Rental duration management
- Location-based services

### 🛡️ Security Services
- Professional security service booking
- Various security packages
- Service customization options

### 🎯 Attractions & Events
- Tourist attraction bookings
- Event reservations
- Local experience packages

### 🎨 Modern UI/UX
- Responsive design for all devices
- Clean, modern interface
- Intuitive navigation with pill-style menu
- Multi-language support (EN, ES, FR, DE, IT)
- Shopping cart functionality
- User authentication system

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.1.0
- **Build Tool:** Vite 6.3.5
- **Styling:** Tailwind CSS 4.1.8
- **UI Components:** Ant Design 5.27.1
- **Routing:** React Router DOM 6.28.0
- **Icons:** Lucide React 0.542.0
- **Charts:** Recharts 3.1.2
- **Date Handling:** Day.js 1.11.18

## 📁 Project Structure

```
fasify-web/
├── public/
│   ├── ExploreAllServices/     # Service images
│   ├── RecommendedAttractions/ # Attraction images
│   ├── SecurityProviders/      # Security service images
│   ├── car/                    # Car rental images
│   └── hotel/                  # Hotel images
├── src/
│   ├── assets/                 # Static assets
│   ├── common/                 # Shared components
│   │   ├── Footer/
│   │   ├── Navbar/
│   │   └── Sidebar/
│   ├── components/             # Reusable components
│   │   ├── HotelCard/
│   │   └── ServiceCard/
│   ├── layout/                 # Layout components
│   ├── pages/                  # Page components
│   │   ├── AboutFasify/
│   │   ├── AttractionReservation/
│   │   ├── Auth/
│   │   ├── CarReservation/
│   │   ├── Contact/
│   │   ├── Dashboard/
│   │   ├── Help/
│   │   ├── Home/
│   │   ├── HotelReservation/
│   │   ├── Legal/
│   │   ├── Offers/
│   │   ├── Payment/
│   │   └── SecurityReservation/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fasify-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

This project is configured for deployment on Vercel with the following settings:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite
- **Install Command:** `npm install --include=optional`

### Deploy to Vercel

1. Connect your repository to Vercel
2. The deployment will automatically use the `vercel.json` configuration
3. Your app will be live at your Vercel domain

## 🎯 Key Pages & Features

### Home Page
- Hero section with main search
- Impact statistics
- Most visited hotels showcase
- Service exploration section
- Recommended attractions
- Why choose FASIFY section
- Customer testimonials
- Service showcase

### Hotel Reservation System
- Comprehensive search functionality
- Advanced filtering options:
  - Price range slider
  - City selection
  - Hotel name search
- Guest and room management
- Date range selection
- Responsive hotel grid layout
- Real-time search results

### Navigation
- Fixed header with brand logo
- Pill-style navigation menu
- Active route highlighting
- Mobile-responsive hamburger menu
- Multi-language support
- Shopping cart integration
- User authentication buttons

## 🎨 Design System

- **Primary Color:** #0064D2 (Blue)
- **Typography:** System fonts with Tailwind CSS
- **Components:** Ant Design component library
- **Icons:** Lucide React icon set
- **Responsive:** Mobile-first approach

## 🔧 Configuration Files

- **ESLint:** `eslint.config.js` - Code linting rules
- **Vite:** `vite.config.js` - Build configuration with Tailwind CSS
- **Vercel:** `vercel.json` - Deployment configuration

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ by the FASIFY Team**