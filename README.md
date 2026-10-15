Sweet Treats – AI Bakery Management System
1. Project Overview

Sweet Treats is an AI-powered bakery management application designed to help bakery owners and staff manage daily bakery operations efficiently. The system provides tools for customer communication, order management, production planning, ingredient costing, inventory monitoring, and AI-powered baking assistance.

The application features a user-friendly interface with terracotta and chocolate brown colours, elegant typography, and a responsive design suitable for desktop, tablet, and mobile devices.

Sweet Treats was previously known as BakeWise AI and has been redesigned to provide a consistent visual identity and improved user experience.

2. Features
Dashboard
Displays a welcome message and today's date.
Provides four summary statistic cards.
Shows the daily production overview.
Displays upcoming collections and highlights those due soon.
Provides inventory alerts and stock warnings.
Includes AI baking tips and quick actions.
Uses clearly labelled demo data.
Customer Messages
Generates customer communication content.
Provides separate subject and message fields.
Allows users to edit messages.
Includes individual Copy buttons for the subject and message.
Order Notes
Organises order information into separate cards.
Highlights missing information and potential risks.
Provides helpful tips, loading messages, and empty states.
Production Planner
Organises bakery production information.
Displays results in structured cards.
Highlights missing details, risks, and warnings.
Provides guidance and clear loading and empty states.
Ingredients & Costs
Presents ingredient and costing information.
Organises results into cards with icons.
Highlights missing information and potential cost-related risks.
Provides helpful tips and status messages.
Bakery AI Chat
Allows users to start new conversations.
Provides a conversation list for accessing previous chats.
Includes five starter questions.
Allows users to copy individual AI responses.
Displays a "Thinking…" indicator during processing.
Stores chat history in the browser.
Responsive Design
Provides a sidebar with navigation to all six pages.
Displays the current page name in the top navigation bar.
Includes a collapsible sidebar for mobile devices.
Uses consistent colours, typography, and branding throughout the application.
3. Tools and Technologies Used
Lovable: Used to develop and design the application.
TypeScript: Used for typed application code and TSX component files.
React: Used for building reusable user interface components, subject to confirmation from the project configuration.
CSS: Used to style the application, including colours, typography, and responsive layouts.
AI integration: Supports the application's intended AI-powered bakery assistance and chat features.
Browser storage: Used to retain chat history locally in the browser.

The exact libraries, AI provider, and development tools depend on the project's implementation and configuration.

4. Setup Instructions
Prerequisites
Access to the Sweet Treats project.
Node.js installed if required by the project.
A compatible package manager, such as npm.
Any required environment variables or API credentials, if applicable.
Step 1: Open the Project

Open the Sweet Treats project in Lovable or obtain the source code from its connected repository, if available.

Step 2: Install Dependencies

Open a terminal in the project directory and install the dependencies using the package manager configured for the project.

For npm-based projects, run:

npm install

Step 3: Configure Environment Variables

Check the project configuration for any required environment variables or AI service credentials.

Add the necessary values to the appropriate local environment file if required. Never share or commit secret API keys.

Step 4: Run the Application

If the project defines the appropriate development script in package.json, run:

npm run dev

Step 5: Open the Application

Open the local URL displayed in the terminal in your web browser. For a typical Vite development server, this may be:

(https://rafiqah-kirby-ai-assistant.lovable.app)

The actual URL may vary depending on the project configuration.

Step 6: Test the Application

Verify that:

All six pages load correctly.
Navigation works on desktop and mobile.
Demo data displays correctly.
Copy buttons and chat interactions work as expected.
The application builds without errors.

Note: Confirm that the project builds successfully before considering setup complete. The previously reported error in src/components/ai-elements/shimmer.tsx must be resolved and tested.
