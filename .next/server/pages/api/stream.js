"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/stream";
exports.ids = ["pages/api/stream"];
exports.modules = {

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "(api)/./pages/api/stream.js":
/*!*****************************!*\
  !*** ./pages/api/stream.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction handler(req, res) {\n    const videoPath = \"/home/aman/Desktop/workspace/ip_cameras/output/output.mp4\"; // Update with the path to your video file\n    const videoStat = fs__WEBPACK_IMPORTED_MODULE_0___default().statSync(videoPath);\n    const fileSize = videoStat.size;\n    const range = req.headers.range;\n    // Set cache-control headers to prevent caching\n    res.setHeader(\"Cache-Control\", \"no-cache, no-store, must-revalidate\");\n    res.setHeader(\"Pragma\", \"no-cache\");\n    res.setHeader(\"Expires\", \"0\");\n    if (range) {\n        const parts = range.replace(/bytes=/, \"\").split(\"-\");\n        const start = parseInt(parts[0], 10);\n        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;\n        const chunkSize = end - start + 1;\n        const file = fs__WEBPACK_IMPORTED_MODULE_0___default().createReadStream(videoPath, {\n            start,\n            end\n        });\n        const head = {\n            \"Content-Range\": `bytes ${start}-${end}/${fileSize}`,\n            \"Accept-Ranges\": \"bytes\",\n            \"Content-Length\": chunkSize,\n            \"Content-Type\": \"video/mp4\"\n        };\n        res.writeHead(206, head);\n        file.pipe(res);\n    } else {\n        const head = {\n            \"Content-Length\": fileSize,\n            \"Content-Type\": \"video/mp4\"\n        };\n        res.writeHead(200, head);\n        fs__WEBPACK_IMPORTED_MODULE_0___default().createReadStream(videoPath).pipe(res);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvc3RyZWFtLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFvQjtBQUVMLFNBQVNDLFFBQVFDLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBRXhDLE1BQU1DLFlBQVksNkRBQTZELDBDQUEwQztJQUV6SCxNQUFNQyxZQUFZTCxrREFBVyxDQUFDSTtJQUM5QixNQUFNRyxXQUFXRixVQUFVRyxJQUFJO0lBQy9CLE1BQU1DLFFBQVFQLElBQUlRLE9BQU8sQ0FBQ0QsS0FBSztJQUU3QiwrQ0FBK0M7SUFDL0NOLElBQUlRLFNBQVMsQ0FBQyxpQkFBaUI7SUFDL0JSLElBQUlRLFNBQVMsQ0FBQyxVQUFVO0lBQ3hCUixJQUFJUSxTQUFTLENBQUMsV0FBVztJQUUzQixJQUFJRixPQUFPO1FBQ1QsTUFBTUcsUUFBUUgsTUFBTUksT0FBTyxDQUFDLFVBQVUsSUFBSUMsS0FBSyxDQUFDO1FBQ2hELE1BQU1DLFFBQVFDLFNBQVNKLEtBQUssQ0FBQyxFQUFFLEVBQUU7UUFDakMsTUFBTUssTUFBTUwsS0FBSyxDQUFDLEVBQUUsR0FBR0ksU0FBU0osS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNTCxXQUFXLENBQUM7UUFDNUQsTUFBTVcsWUFBWUQsTUFBTUYsUUFBUTtRQUNoQyxNQUFNSSxPQUFPbkIsMERBQW1CLENBQUNJLFdBQVc7WUFBRVc7WUFBT0U7UUFBSTtRQUV6RCxNQUFNSSxPQUFPO1lBQ1gsaUJBQWlCLENBQUMsTUFBTSxFQUFFTixNQUFNLENBQUMsRUFBRUUsSUFBSSxDQUFDLEVBQUVWLFNBQVMsQ0FBQztZQUNwRCxpQkFBaUI7WUFDakIsa0JBQWtCVztZQUNsQixnQkFBZ0I7UUFDbEI7UUFFQWYsSUFBSW1CLFNBQVMsQ0FBQyxLQUFLRDtRQUNuQkYsS0FBS0ksSUFBSSxDQUFDcEI7SUFDWixPQUFPO1FBQ0wsTUFBTWtCLE9BQU87WUFDWCxrQkFBa0JkO1lBQ2xCLGdCQUFnQjtRQUNsQjtRQUVBSixJQUFJbUIsU0FBUyxDQUFDLEtBQUtEO1FBQ25CckIsMERBQW1CLENBQUNJLFdBQVdtQixJQUFJLENBQUNwQjtJQUN0QyxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2lwLWNhbWVyYXMvLi9wYWdlcy9hcGkvc3RyZWFtLmpzPzZiYTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuXG4gIGNvbnN0IHZpZGVvUGF0aCA9ICcvaG9tZS9hbWFuL0Rlc2t0b3Avd29ya3NwYWNlL2lwX2NhbWVyYXMvb3V0cHV0L291dHB1dC5tcDQnOyAvLyBVcGRhdGUgd2l0aCB0aGUgcGF0aCB0byB5b3VyIHZpZGVvIGZpbGVcblxuICBjb25zdCB2aWRlb1N0YXQgPSBmcy5zdGF0U3luYyh2aWRlb1BhdGgpO1xuICBjb25zdCBmaWxlU2l6ZSA9IHZpZGVvU3RhdC5zaXplO1xuICBjb25zdCByYW5nZSA9IHJlcS5oZWFkZXJzLnJhbmdlO1xuXG4gICAgLy8gU2V0IGNhY2hlLWNvbnRyb2wgaGVhZGVycyB0byBwcmV2ZW50IGNhY2hpbmdcbiAgICByZXMuc2V0SGVhZGVyKCdDYWNoZS1Db250cm9sJywgJ25vLWNhY2hlLCBuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlJyk7XG4gICAgcmVzLnNldEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XG4gICAgcmVzLnNldEhlYWRlcignRXhwaXJlcycsICcwJyk7XG5cbiAgaWYgKHJhbmdlKSB7XG4gICAgY29uc3QgcGFydHMgPSByYW5nZS5yZXBsYWNlKC9ieXRlcz0vLCAnJykuc3BsaXQoJy0nKTtcbiAgICBjb25zdCBzdGFydCA9IHBhcnNlSW50KHBhcnRzWzBdLCAxMCk7XG4gICAgY29uc3QgZW5kID0gcGFydHNbMV0gPyBwYXJzZUludChwYXJ0c1sxXSwgMTApIDogZmlsZVNpemUgLSAxO1xuICAgIGNvbnN0IGNodW5rU2l6ZSA9IGVuZCAtIHN0YXJ0ICsgMTtcbiAgICBjb25zdCBmaWxlID0gZnMuY3JlYXRlUmVhZFN0cmVhbSh2aWRlb1BhdGgsIHsgc3RhcnQsIGVuZCB9KTtcblxuICAgIGNvbnN0IGhlYWQgPSB7XG4gICAgICAnQ29udGVudC1SYW5nZSc6IGBieXRlcyAke3N0YXJ0fS0ke2VuZH0vJHtmaWxlU2l6ZX1gLFxuICAgICAgJ0FjY2VwdC1SYW5nZXMnOiAnYnl0ZXMnLFxuICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogY2h1bmtTaXplLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd2aWRlby9tcDQnLFxuICAgIH07XG5cbiAgICByZXMud3JpdGVIZWFkKDIwNiwgaGVhZCk7XG4gICAgZmlsZS5waXBlKHJlcyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaGVhZCA9IHtcbiAgICAgICdDb250ZW50LUxlbmd0aCc6IGZpbGVTaXplLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd2aWRlby9tcDQnLFxuICAgIH07XG5cbiAgICByZXMud3JpdGVIZWFkKDIwMCwgaGVhZCk7XG4gICAgZnMuY3JlYXRlUmVhZFN0cmVhbSh2aWRlb1BhdGgpLnBpcGUocmVzKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbImZzIiwiaGFuZGxlciIsInJlcSIsInJlcyIsInZpZGVvUGF0aCIsInZpZGVvU3RhdCIsInN0YXRTeW5jIiwiZmlsZVNpemUiLCJzaXplIiwicmFuZ2UiLCJoZWFkZXJzIiwic2V0SGVhZGVyIiwicGFydHMiLCJyZXBsYWNlIiwic3BsaXQiLCJzdGFydCIsInBhcnNlSW50IiwiZW5kIiwiY2h1bmtTaXplIiwiZmlsZSIsImNyZWF0ZVJlYWRTdHJlYW0iLCJoZWFkIiwid3JpdGVIZWFkIiwicGlwZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/stream.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/stream.js"));
module.exports = __webpack_exports__;

})();