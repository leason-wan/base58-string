# base58-string

## What?

base58 encode decode without buffer;  
input string out string;  
suport browser;  
use utf-8;  
因为是UTF-8编码，所以支持中文;

## Installation

```shell
npm install base58-string
```

## CDN
```html
<!-- import JavaScript -->
<script src="https://unpkg.com/base58-string/index.cdn.js"></script>
```

## Usage

```javascript
const Bs = require('base58-string');
Bs.encode('base58'); // 'qzTiEHgB'
Bs.decode('qzTiEHgB'); // 'base58'
```

## License

Released under the MIT license. Copyright (c) 2018 fadeneo.