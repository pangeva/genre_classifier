# Genre Classifier

The following project contains genre classification.

### Scripts

- **index.py:** main training logic
- **login_to_huggingface.py:** login and push the model to huggingface
- **test_model.py:** test the model locally with an .mp3 input

### UI

The `genre-classifier-ui` contains a simple NextJS frontend.

> There is one more script like the `test_model.py` inside the `genre-classifier-ui` which is being executed by the frontend.

To start the UI, do the following:

```
cd genre-classifier-ui
npm install
npm run dev
```

You will get an output with the localhost:port, CTRL + right click to open the web page.

:)