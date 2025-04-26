# Music Player Desktop Widget - Electron Desktop Widget

## Overview

This project is an Electron-based desktop widget designed to play music through your own playlist of songs, which allows you to seamlessly play and change your music while you work. The functionality requires local file system access, specifically for user-provided images and audio.

The core functionality (excluding local file access) is also available in a web version, if Electron is chosen not to be used. This Electron version is what bridges the gap by allowing direct access to local media files in order to play your music on a whim.

**Important Note:** The `node_modules` directory is **not** included in this repository. This is because the necessary dependency exceeds the common repository size limit of 100MB. You **must** run `npm install` after cloning to fetch the required packages.

## Features

*   Displays custom local images for personalized customization.
*   Plays custom local audio files which can curate to every single person individually.
*   Operates as a desktop widget for seamless interaction.

## Why Electron?

Electron was chosen to enable this application to run as a standalone desktop program with the necessary permissions to access the user's local file system for loading custom images and audio tracks, which is not possible in a standard web browser environment for security reasons.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** (Includes npm) - Download and install from [nodejs.org](https://nodejs.org/). A recent LTS version is recommended.
*   **Git:** (Optional, if cloning via Git) - Download and install from [git-scm.com](https://git-scm.com/).

## Installation & Setup

Follow these steps to get the application running locally:

1.  **Clone the Repository:**
    ```
    git clone [your-repository-url]
    cd [your-project-directory]
    ```

2.  **Install Dependencies:** Navigate to the project directory in your terminal and run:
    ```
    npm install
    ```
    This command reads the `package.json` file and installs all necessary dependencies (including Electron, if listed) into the `node_modules` folder.

3.  **Install Electron (if not in `package.json`):** If Electron wasn't listed as a dependency in `package.json` (check the file), you might need to install it explicitly:
    ```
    npm install --save-dev electron
    ```
    *(Using `--save-dev` adds it to your development dependencies, which is standard practice for build tools like Electron)*. If `npm install` in step 2 worked without errors related to Electron, you can likely skip this step.

## Configuration: Adding Your Media

This application requires you to manually specify the paths to your local image and audio files.

1.  Open the `scripts.js` file in a text editor.
2.  Locate the sections designated for image and song paths (e.g., look for the songs array, and variables like `title`, `artist`, `src`, and `artwork`. 
3.  Modify the arrays or variables to include the **full paths** or **relative paths** (relative to the project's root directory) to your desired image and audio files.

    **Example (modify according to the actual structure in `scripts.js`):**
    ```script.js
    const songs = [
        { title: "PLACEHOLD1", artist: "ARTIST1", src: "audio/audio1mp3", artwork: "images/coversong1.jpg" },
        { title: "PLACEHOLD2", artist: "ARTIST2", src: "audio/audio2.mp3", artwork: "images/coversong2.jpg" },
        { title: "PLACEHOLD3", artist: "ARTIST3", src: "audio/audio3.mp3", artwork: "images/coversong3.jpg" },
    ];
    ```
    **Important:** Ensure the file paths are correct for your operating system and that the application has the necessary permissions to read from those locations.

## Running the Application

Once the dependencies are installed and you have configured your media files in `scripts.js`:

1.  Open your terminal in the project's root directory.
2.  Run the start command in terminal:
    ```
    npm start
    ```
3.  This will launch the Electron application widget.

## Troubleshooting

*   **Error: Cannot find module 'electron' / other modules:** Ensure you have run `npm install` successfully in the project directory. Delete the `node_modules` folder and `package-lock.json` file and run `npm install` again if problems persist.
*   **Images/Audio not loading:** Double-check the file paths in `scripts.js`. Verify they are spelled correctly, use the correct slashes for your OS (`/` for Mac/Linux, `\\` for Windows, and that the files exist at those locations.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
