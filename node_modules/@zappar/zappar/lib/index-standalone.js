"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOptions = void 0;
const zappar_1 = require("./zappar");
__exportStar(require("./index"), exports);
const _worker = new (require("worker-loader?inline=fallback!@zappar/zappar-cv/lib/worker").default)();
zappar_1.setOptions({ worker: _worker });
function setOptions(opts) {
    zappar_1.setOptions(Object.assign(Object.assign({}, opts), { worker: opts.worker || _worker }));
}
exports.setOptions = setOptions;
