# YTAudio by Arshed

YTAudio by Arshed is a YouTube to MP3 Converter that allows you to convert your favorite videos to MP3 for free.

## Features

- Download YouTube videos.
- Download and convert YouTube videos to MP3.
- Fast and reliable conversion process.
- Easy-to-use interface.
- No ads.

## Installation

### Prerequisites

- [Python](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/Arshed-Ahmed/YTAudio-by-Arshed.git
    cd YTAudio-by-Arshed
    ```

2. Install Python dependencies:

    ```bash
    pip install -r backend/requirements.txt
    ```

3. Install Node.js dependencies:

    ```bash
    cd frontend
    npm install
    ```

## Usage

1. Run the backend server:

    ```bash
    cd backend
    python manage.py runserver
    ```

2. Run the frontend server:

    ```bash
    cd frontend
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:3000`.

4. Enter the URL of the YouTube video you want to convert and click "Convert".

## Docker Setup

You can also run the application using Docker:

1. Build and start the containers:

    ```bash
    docker-compose up --build
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or issues, please open an issue or contact the repository owner.

---

Feel free to customize this template further with any additional information or sections you think are necessary.
