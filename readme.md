<div align="center">
  <img src="logo.png" alt="workfly" width="620" />
</div>
<div align="center">A fast & ultra-lightweight framework for Cloudflare Workers, inspired by Express.js</div>

## Features

- Designed with zero dependencies
- First-Class TypeScript Support
- Custom Middleware Support
- Fully Treeshakable and More

## Installation

To install workfly, run the following command:

```bash
npm install --save workfly
```

## Quick Start

Here's a quick example to get you started:

```javascript
import workfly from 'workfly';

const app = workfly();

// Define a route with a parameter
app.get('/hello/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `Hello, ${id}!` });
});

// Start the server
app.listen();
```

## Contributing

Contributions are welcome! Please submit issues and pull requests to help improve workfly.

## License

This project is licensed under the MIT License.
