/**
 * Content Acquisition — single-spa lifecycle entry point.
 *
 * Exports { bootstrap, mount, unmount } consumed by the host's
 * single-spa parcel loader or registry.
 */
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import CaApp from './ca-app';
import { metadata } from './types';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: CaApp,
  errorBoundary(err: Error) {
    return (
      <div style={{ padding: '2rem', color: '#dc2626' }}>
        <h2>Content Acquisition — Error</h2>
        <pre>{err.message}</pre>
      </div>
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
export { metadata };
