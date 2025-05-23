# AI Content Agent - ContentAI

[LIVE DEMO](https://contentai-edasgh.vercel.app/)

## Overview

ContentAI is an AI-powered platform that helps content creators analyze, transcribe, and optimize their YouTube videos. The tool leverages artificial intelligence to provide deep insights, auto-generate video scripts, create engaging thumbnails, and many more.

## Features

- **AI Analysis**: Gain insights into viewer engagement and content quality.
- **Auto Transcription**: Convert YouTube videos into accurate transcripts.
- **Video Chapters Generator**: Generate timestamped video chapters for ease of Audience Experience.
- **AI Script Generator**: Generate engaging scripts for YouTube videos.
- **AI Blog Post Generator**: Generate descriptive, SEO-friendly blog posts.
- **AI Social Media Post Generator**: Generate engaging, concise custom social media posts.
- **AI Title Generator**: Generate catchy, SEO friendly titles for YouTube videos.
- **Thumbnail Creator**: Automatically create high-quality thumbnails.
- **Engagement Metrics**: Track views, likes, comments, and retention.
- **Target Audience Analysis**: Get target audience analysis of any YouTube video

## How It Works

1. **Connect with your content**: Share your YouTube video URL.
2. **Get AI-Powered Insights**: Extract transcripts, analyze engagement, and generate a script.
3. **Receive Ready-to-Use Content**: Download the transcript, script, AI-generated thumbnail and many more.

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Convex
- **Authentication**: Clerk
- **State Management**: Redux Toolkit
- **AI Integration**: Gemini, Together AI, Vercel AI SDK

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Edasgh/contentAI.git
   cd contentAI
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file and configure environment variables:

   ```sh
        # Clerk

        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
        CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

        # Schematic

        NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY=api_your_schematic_publishable_key
        SCHEMATIC_API_KEY=sch_dev_your_schematic_api_key

        # Youtube API

        YOUTUBE_API_KEY=your_youtube_api_key

        # Deployment used by `npx convex dev`

        CONVEX_DEPLOYMENT=dev:your-convex-deployment # team: your-team, project: your-project

        NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

        # Gemini

        GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

        #together ai api key
        TOGETHER_API_KEY=sk-ant-api03-your_together_ai_api_key

        # BASE URL

        NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

````
4. Run the development server:
```sh
npm run dev
````

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

You can deploy the project using Vercel:

```sh
vercel
```

Ensure you have set up the required environment variables in Vercel.

## Contributing

Feel free to contribute by submitting issues or pull requests. Make sure to follow the project's coding standards.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, reach out via [My Email](mailto:edas25564@gmail.com).
