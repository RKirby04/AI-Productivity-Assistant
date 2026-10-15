Sweet Treats 🍰
1. Project Overview

Sweet Treats is an AI-powered bakery management application designed to help bakery owners and staff organise daily operations efficiently. Formerly known as BakeWise AI, the application features a refreshed visual identity with terracotta and chocolate brown colours, elegant serif headings, and a modern, user-friendly interface.

The application brings essential bakery management tools together in one place, including production planning, customer communication, ingredient costing, order notes, inventory monitoring, and AI-powered baking assistance.

The application currently uses demo data for sample orders and stock, making it suitable for demonstrating its features and exploring bakery management workflows.

2. Features
Dashboard
Personalised welcome message and current date.
Pastry photography and bakery-themed design.
Four summary statistic cards.
Daily production overview.
Upcoming collections with items marked as "Due soon".
Inventory alerts and stock warnings.
AI-generated baking tips.
Quick-action shortcuts.
Clearly labelled demo data.
Customer Messages
Generate customer communication content.
Separate subject line and message fields.
Editable content before sending or copying.
Individual Copy buttons for the subject and message.
Order Notes
Display order-related results in organised cards with icons.
Highlight missing information in amber.
Identify risks and warnings in red.
Provide helpful tips, loading messages, and empty states.
Production Planner
Organise and review bakery production information.
Present results in separate, easy-to-read cards.
Highlight missing details, risks, and warnings.
Provide contextual tips and loading and empty states.
Ingredients & Costs
Review ingredient and costing information.
Display results in structured cards with icons.
Highlight missing information and potential cost-related risks.
Provide contextual guidance and clear loading and empty states.
Bakery AI Chat
Start conversations using the New Chat button.
Browse previous conversations using the conversation list.
Access conversation navigation on mobile devices.
Choose from five starter questions.
Copy individual AI responses.
Display a "Thinking…" indicator while the AI is processing a response.
Save chat history in the current browser, according to the application's current implementation.
Responsive Design and Navigation
Light sidebar containing all six application pages.
Top navigation bar displaying the current page name.
Collapsible sidebar with a menu button on mobile devices.
Consistent branding, colours, typography, and layout across the application.
Responsive layouts designed for desktop, tablet, and mobile screens.
3. Tools and Technologies Used

The project uses a modern web application structure. The following technologies are identifiable from the supplied project information or file paths; the complete dependency list should be confirmed from the project's configuration files.

TypeScript (TSX): Used for component files such as src/components/ai-elements/shimmer.tsx.
React-style components: Used to organise interface elements into reusable components.
AI-powered features: Intended to support bakery assistance, customer messaging, production planning, ingredient costing, and conversational interactions.
CSS and styling tools: Used to implement the colour palette, typography, responsive layouts, and visual design.
Lovable: Used as the application development environment.
Browser storage: Used for locally saved chat history, as described by the current application design.

The exact frameworks, libraries, AI provider, package manager, and build tools should be verified against package.json, the lockfile, and the application's source code before this section is considered final.

4. Setup Instructions
Prerequisites

Before setting up the project, ensure you have:

Node.js installed if the project uses a Node.js-based development environment.
The project's package manager, identified from its lockfile.
Access to the Sweet Treats project source code.
Any required AI service credentials or environment variables, if applicable.
Step 1: Open the project

Open the Sweet Treats project in Lovable or obtain its source code through the project's configured GitHub integration, if available.

Step 2: Install dependencies

Open a terminal in the project root directory and use the package manager that matches the project configuration.

For example, if the project uses npm:

npm install

Step 3: Configure environment variables

Check the project's documentation and existing environment variable examples for any required configuration.

If an AI provider or another external service requires credentials, add the necessary variables to the appropriate local environment file, such as .env, using the variable names expected by the application.

Do not commit API keys, passwords, or other secrets to version control.

If the application does not require external credentials, this step may not be necessary.

Step 4: Start the development server

For an npm-based project, the command is commonly:

npm run dev


Confirm that the dev script exists in package.json before running it.

Step 5: Open the application

Follow the local URL displayed in the terminal. For many Vite-based applications, the default address is:

http://localhost:5173


The actual address may differ depending on the project's configuration.

Step 6: Verify the application

Once the application starts, check that:

All six pages load correctly.
Navigation and responsive layouts work.
Demo data is displayed as expected.
Customer message and AI response Copy buttons work.
Bakery AI Chat handles conversations and chat history correctly.
The AI processing indicator displays appropriately.
No build errors prevent the application from running.

Note: The project was reported to have a remaining build error in src/components/ai-elements/shimmer.tsx. A fresh successful build and full application test have not yet been confirmed. Resolve this issue before considering the setup and verification complete.

5. Team Members

Team member information was not provided. Complete this section with the verified contributors.

Project developer: [Add name]
UI/UX designer: [Add name, if applicable]
AI integration developer: [Add name, if applicable]
Project supervisor: [Add name, if applicable]

If this is an individual project, replace the list with the developer's name and relevant role. Remove any roles that do not apply.

6. Project Status

Sweet Treats has undergone a visual redesign and feature-layout update. The remaining build error and subsequent functional and responsive testing still need to be resolved and verified.

The application should be considered a work in progress until the build succeeds and the main features have been tested.

7. Future Improvements

Potential improvements include:

Connecting persistent bakery orders and inventory to a database.
Integrating and verifying an AI service for bakery assistance.
Adding user authentication and access control.
Introducing a dedicated Settings page if required.
Adding automated tests for key features.
Implementing production-ready deployment and monitoring.

These are possible future enhancements and are not claims about existing functionality.

Project name: Sweet Treats
Previous name: BakeWise AI
Purpose: AI-assisted bakery management
Development platform: Lovable
