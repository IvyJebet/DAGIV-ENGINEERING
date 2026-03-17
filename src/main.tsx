import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';

/**
 * ============================================================================
 * Google Translate / React DOM Mutation Fix
 * ============================================================================
 * This monkey-patches the browser's native DOM manipulation methods.
 * It prevents React from crashing with a "NotFoundError" when Google Translate
 * aggressively replaces text nodes with <font> tags.
 */
if (typeof window !== 'undefined' && typeof Node === 'function' && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    
    // @ts-ignore - overriding native method
    Node.prototype.removeChild = function (child) {
        if (child.parentNode !== this) {
            if (console) {
                console.warn(
                    'React/Google Translate Conflict: Attempted to remove a child from a different parent. Intercepted to prevent crash.',
                    child,
                    this
                );
            }
            return child;
        }
        return originalRemoveChild.apply(this, arguments as any);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    
    // @ts-ignore - overriding native method
    Node.prototype.insertBefore = function (newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode !== this) {
            if (console) {
                console.warn(
                    'React/Google Translate Conflict: Attempted to insert before a node from a different parent. Intercepted to prevent crash.',
                    referenceNode,
                    this
                );
            }
            return newNode;
        }
        return originalInsertBefore.apply(this, arguments as any);
    };
}
// ============================================================================

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);