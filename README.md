# Project Halo - Exam Generator

An AI-powered exam paper generation tool for educators built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎯 **Question Bank Management**: Browse and filter questions by subject, topic, class level, and type
- 📝 **Exam Paper Creation**: Create custom exam papers with multiple sections
- 🎨 **Modern UI**: Beautiful, responsive interface built with Radix UI components
- 📊 **Question Types**: Support for multiple choice, short answer, essay, and true/false questions
- 🔍 **Advanced Filtering**: Filter questions by various criteria
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Dark/Light Theme**: Built-in theme switching support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Local JSON-based storage (no external dependencies)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: jsPDF

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd halo
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
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
halo/
├── app/                    # Next.js app directory
│   ├── create/            # Exam creation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── exam-creator.tsx  # Main exam creation component
│   ├── exam-paper.tsx    # Exam paper display component
│   ├── question-bank.tsx # Question bank component
│   └── ...
├── lib/                  # Utility functions and configurations
│   ├── database.ts       # Database interface
│   ├── local-database.ts # Local database implementation
│   ├── utils.ts          # Utility functions
│   └── pdf-generator.ts  # PDF generation utilities
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── styles/               # Additional styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database

The application uses a local JSON-based database system that stores data in memory during the session. This approach:

- ✅ **No external dependencies** - No need for PostgreSQL, MongoDB, or other databases
- ✅ **Easy setup** - Works out of the box without configuration
- ✅ **Fast development** - Perfect for prototyping and local development
- ✅ **Sample data included** - Comes with pre-loaded sample questions

### Sample Data

The application includes sample questions covering:
- **Mathematics**: Algebra, Geometry
- **Science**: Chemistry, Biology, Physics
- **English**: Literature, Grammar
- **History**: World Wars, Industrial Revolution

## Features Overview

### Question Bank
- Browse questions by subject, topic, class level, and type
- Search functionality
- Pagination support
- Filter options

### Exam Creation
- Create custom exam papers
- Add multiple sections
- Drag and drop question organization
- Mark allocation per question
- PDF export functionality

### Question Types
- **Multiple Choice**: Select from 4 options
- **Short Answer**: Text input responses
- **Essay**: Long-form written responses
- **True/False**: Binary choice questions

## Development

### Adding New Question Types

1. Update the `Question` interface in `components/exam-creator.tsx`
2. Add the new type to the question type filter options
3. Update the question display components to handle the new type

### Customizing the UI

The application uses Tailwind CSS for styling and Radix UI for accessible components. You can:

- Modify colors in `tailwind.config.js`
- Add new components in `components/ui/`
- Update the theme in `components/theme-provider.tsx`

### Database Schema

The local database includes the following entities:

- **Questions**: Store individual exam questions
- **Exam Papers**: Store created exam papers
- **Sections**: Organize questions within exam papers
- **Exam Paper Questions**: Junction table linking questions to exam papers

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/halo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Project Halo** - Making exam creation simple and efficient for educators worldwide.