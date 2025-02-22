# Drive Clone

Drive Clone is a web application that mimics the functionality of a cloud storage service. It allows users to securely store, manage, and share files and folders.

## Features

- User authentication and authorization
- File and folder management
- File uploading
- Responsive UI with Tailwind CSS
- Real-time updates and notifications

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- pnpm (version 9.15.3 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/drive-clone.git
   cd drive-clone
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add the following variables:

   ```plaintext
   DATABASE_URL=your_database_url
   UPLOADTHING_TOKEN=your_uploadthing_token
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
   ```

4. Run the development server:

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
pnpm build
```

### Running Tests

To run linting and type-checking:

```bash
pnpm check
```

## Scripts

The following scripts are available in the `package.json`:

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality issues.
- `typecheck`: Runs TypeScript type-checking.

## Screenshots

Include screenshots of your application here to give users a visual overview of the UI and features.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.dev/)
- [Uploadthing](https://uploadthing.com/)
