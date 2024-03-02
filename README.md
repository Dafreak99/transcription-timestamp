# Free Tailwind & Vue.js admin dashboard template

![Mosaic TailwindCSS template preview](https://github.com/cruip/vuejs-admin-dashboard-template/assets/2683512/2fdc15d1-316b-4c51-b357-84b32e79de60)

## Table of contents

- [Usage](#usage)
  - [Project setup](#project-setup)
    - [Compiles and hot-reloads for development](#compiles-and-hot-reloads-for-development)
    - [Compiles and minifies for production](#compiles-and-minifies-for-production)
    - [Customize configuration](#customize-configuration)
- [User Workflow](#workflow)

## Usage

This project was built with [Vue 3](https://v3.vuejs.org/) and [Vite](https://vitejs.dev/).

### Project setup

```
npm install
```

#### Compiles and hot-reloads for development

```
npm run dev
```

#### Compiles and minifies for production

```
npm run build
```

## Workflows

1. User uploads an MP3/MP4 file through a form on the frontend (Vue.js).
2. Frontend sends the uploaded file data (including the file itself) to the backend (Django) at the endpoint http://127.0.0.1:8000/upload/ via a POST request.
3. Backend interacts with Cloudinary to upload the file.
4. Upon successful upload, the backend receives the public URL from Cloudinary and sends it back to the frontend.
5. Frontend receives the public URL and sends it to the Gladia platform for transcription.
6. After transcription, the video player is displayed with:
   - Timestamped transcription: Displays full sentences with highlighted words per second.
   - Seek functionality: Allows users to navigate the video/audio based on timestamps. When seeking (e.g., going to 00:30), the highlighted words at that position are displayed.
7. For video files: a Picture-in-Picture (PIP) window shows the video on the right side of the screen.
8. For MP3 files or other audio formats: no PIP window is displayed.

Overall, the application provides a seamless user experience for uploading audio/video files, transcribing them with Gladia, and visualizing the results with timestamps, highlighted words, and video/audio playback functionalities.
