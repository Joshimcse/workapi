<div align="center">
  <img src="logo.png" alt="worktop" width="620" />
</div>
<div align="center">A fast & ultra-lightweight framework for Cloudflare Workers, inspired by Express.js</div>

## Features
* Designed with zero dependencies
* First-Class TypeScript Support
* Custom Middleware Support
* Fully Treeshakable and More

## Installation

To install workapi, run the following command:

```bash
npm install --save workapi
```

## Quick Start

Here's a quick example to get you started:

```javascript
import workapi from 'workapi';

const app = workapi();

// Define a route with a parameter
app.get('/hello/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `Hello, ${id}!` });
});

// Start the server
app.listen();
```


## Contributing

Contributions are welcome! Please submit issues and pull requests to help improve WorkAPI.

## License

This project is licensed under the MIT License.
