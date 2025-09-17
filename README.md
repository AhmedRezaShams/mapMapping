-----

# Map Area Analyzer 🗺️

A React-based web application for drawing shapes on a Google Map, calculating their areas, and generating screenshots. This tool is built to provide a simple yet powerful interface for geographic area analysis.

## ✨ Features

  * **Interactive Drawing Tools:** Draw polygons, circles, and rectangles directly on the map.
  * **Real-time Area Calculation:** Automatically computes the area of drawn shapes, displaying results in square meters, hectares, or square kilometers for convenience.
  * **Shape Management:** A dynamic sidebar allows you to view, hide, and delete individual shapes.
  * **Total Area Summary:** Get a cumulative total area of all visible shapes at a glance.
  * **Integrated Screenshot Tool:** Capture a high-quality image of the map with all drawn overlays and the side panel.
  * **Responsive UI:** A clean and intuitive user interface built with Tailwind CSS.

## ⚙️ Technologies Used

This project leverages a modern web development stack to deliver a smooth and performant user experience.

  * **React:** The core JavaScript library for building the user interface.
  * **`@react-google-maps/api`:** A powerful set of React hooks and components for integrating Google Maps seamlessly. This library handles map loading, state management, and interaction with the Google Maps API.
  * **`google.maps.geometry`:** The Google Maps Geometry Library is crucial for performing complex calculations, such as the `spherical.computeArea` function used to accurately determine the area of polygons and rectangles.
  * **`lucide-react`:** A collection of beautiful, open-source icons used throughout the application to enhance the UI.
  * **`html2canvas` & Native Screen Capture API:** A robust approach to capturing the map and its UI elements. The application first attempts to use the more efficient Native Screen Capture API for a full-tab screenshot and falls back to `html2canvas` for broader compatibility.
  * **Tailwind CSS:** A utility-first CSS framework for rapidly styling the application with a focus on a clean and minimalist design.

## 🚀 Getting Started

### Prerequisites

  * Node.js (LTS version)
  * A Google Maps API Key with the following APIs enabled:
      * Maps JavaScript API
      * Geometry Library (usually included with Maps JavaScript API)
      * Drawing Library (usually included with Maps JavaScript API)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  Install dependencies:

    ```bash
    yarn install
    ```

3.  Configure your Google Maps API Key:
    Create a `.env.local` file in the root directory and add your API key.

    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
    ```

4.  Run the application:

    ```bash
    yarn dev
    ```

    The application will be available at `http://localhost:3000`.

## 🎨 How to Use

The application's interface is straightforward and designed for intuitive interaction.

1.  **Select a Tool:** Use the toolbar at the bottom of the map to select a drawing tool:

      * ✋ **Hand Tool:** The default tool for panning the map.
      * \<svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"\>\<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /\>\</svg\> **Polygon Tool:** Click to define the vertices of a shape. Double-click to complete the polygon.
      * ⭕ **Circle Tool:** Click on the map and drag to create a circle.
      * \<Square size={20} /\> **Rectangle Tool:** Click and drag to create a rectangle.

2.  **View Area Analysis:** Once a shape is drawn, the "Area Analysis" panel on the right will automatically open, displaying details about the shape, including its calculated area, creation time, and type.

3.  **Manage Shapes:**

      * **Hide/Show:** Click the eye icon (👁️) next to a shape in the sidebar to toggle its visibility on the map.
      * **Delete:** Click the trash can icon (🗑️) to remove a shape from the map and the analysis list.
      * **Clear All:** Use the "Clear All Areas" button at the bottom of the sidebar to remove all drawn shapes.

4.  **Take a Screenshot:** Click the camera icon (📸) in the bottom toolbar to capture a high-quality screenshot of the current map view, including the sidebar and all drawn shapes.

-----

## 🏗️ Architecture & Component Breakdown

The core logic resides within the `MyMap` component, which orchestrates the entire application. Here's a quick look at the component's structure:

**State Management:**

  * `selectedTool`: Tracks the currently active drawing tool.
  * `areaInfoList`: An array of objects, where each object stores information about a drawn shape (e.g., type, area, visibility). This is the single source of truth for all drawn shapes and their properties.
  * `overlays`: An array that holds direct references to the Google Maps overlay objects, which are managed separately for efficient map manipulation (e.g., showing/hiding or deleting a shape).

**Key Functions:**

  * `handleOverlayComplete`: This is the primary event handler for the `DrawingManager`. It's triggered every time a user finishes drawing a shape. It calculates the area using `google.maps.geometry.spherical.computeArea`, formats the data, and updates the `areaInfoList` state.
  * `handleToolSelect`: Manages the active drawing mode of the `DrawingManager` based on the user's selection from the bottom toolbar.
  * `takeScreenshot`: A self-contained function that utilizes browser APIs to capture the entire viewport, providing a clean screenshot of the application's state.

*A simple flow chart illustrating the interaction between the user, the Map Component, and the State Management logic.*

## 🤝 Contribution

This project is open for collaboration. Feel free to fork the repository, submit a pull request, or report any issues.

## 📝 License

This project is licensed under the MIT License.
