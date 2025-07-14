# SOS Filing Automation

This project automates the submission of LLC or corporate formation documents on Secretary of State (SOS) websites. It is built with Node.js and [Puppeteer](https://pptr.dev/).

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `config.example.json` to `config.json` and adjust the values for the state and form you want to automate.

## Configuration
`config.json` describes one or more filings. Each filing entry contains:
- `url` – the web page where the form starts.
- `fields` – an object mapping CSS selectors to the values to enter.
- `submitSelector` – (optional) selector of the element that submits the form.

See `config.example.json` for a template.

## Usage
Run the script with a configuration file:
```sh
node index.js config.json
```
The script navigates to each URL, fills the specified fields and clicks the submit button if provided.

## Flexibility
All selectors and URLs reside in the configuration file so the automation can adapt to different state websites without changing code.
