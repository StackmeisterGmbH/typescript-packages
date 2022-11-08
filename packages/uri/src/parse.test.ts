import each from 'jest-each'
import parse from './parse'

describe('parse', () => {
  each([
    [
      'parse a full URI with all parts',
      'https://someone:somepass@example.com:443/example/path?a=1&b[]=12&b=test&c#testFragment',
      {
        scheme: 'https',
        userInfo: 'someone:somepass',
        host: 'example.com',
        port: 443,
        path: '/example/path',
        query: 'a=1&b%5B%5D=12&b=test&c',
        fragment: 'testFragment',
      },
    ],
    [
      'have an empty fragment for a fragment that only has the hash',
      'https://example.com/some/path#',
      {
        scheme: 'https',
        host: 'example.com',
        path: '/some/path',
        fragment: '',
      },
    ],
    [
      'leave out the scheme if none is given in the URI string',
      '//someone:somepass@example.com:443/example/path?a=1&b[]=12&b=test&c#testFragment',
      {
        userInfo: 'someone:somepass',
        host: 'example.com',
        port: 443,
        path: '/example/path',
        query: 'a=1&b%5B%5D=12&b=test&c',
        fragment: 'testFragment',
      },
    ],
    [
      'leave out the user info if none is given in the URI string',
      'https://example.com:443/example/path?a=1&b[]=12&b=test&c#testFragment',
      {
        scheme: 'https',
        host: 'example.com',
        port: 443,
        path: '/example/path',
        query: 'a=1&b%5B%5D=12&b=test&c',
        fragment: 'testFragment',
      },
    ],
    [
      'correctly parse a file URI',
      'file:///example/path?a=1&b[]=12&b=test&c#testFragment',
      {
        scheme: 'file',
        path: '/example/path',
        query: 'a=1&b%5B%5D=12&b=test&c',
        fragment: 'testFragment',
      },
    ],
    [
      'correctly parse a file URI without schema (three slashes)',
      '///example/path?a=1&b[]=12&b=test&c#testFragment',
      {
        path: '/example/path',
        query: 'a=1&b%5B%5D=12&b=test&c',
        fragment: 'testFragment',
      },
    ],
    [
      'correctly parse a single path',
      '/example/path?a=1&b[]=12&b=test&c#testFragment',
      {
        path: '/example/path',
        query: 'a=1&b%5B%5D=12&b=test&c',
        fragment: 'testFragment',
      },
    ],
    [
      'correctly parse a query string with a fragment only',
      '?a=1&b[]=12&b=test&c#testFragment',
      {
        query: 'a=1&b%5B%5D=12&b=test&c',
        fragment: 'testFragment',
      },
    ],
    [
      'correctly parse a fragment only',
      '#testFragment',
      {
        fragment: 'testFragment',
      },
    ],
    [
      'correctly parse an e-mail address',
      'someone@example.com',
      {
        path: 'someone@example.com',
      },
    ],
    [
      'correctly parse a relative path',
      'meta/annotation',
      {
        path: 'meta/annotation',
      },
    ],
    [
      'correctly parse an anchored relative path',
      './meta/annotation',
      {
        path: './meta/annotation',
      },
    ],
    [
      'correctly parse an anchored parent relative path',
      '../meta/annotation',
      {
        path: '../meta/annotation',
      },
    ],
    [
      'correctly parse an absolute path with anchors',
      '/meta/../annotation',
      {
        path: '/meta/../annotation',
      },
    ],
    [
      'correctly parse a `tel`-style URI',
      'tel:+06813345611',
      {
        scheme: 'tel',
        path: '+06813345611',
      },
    ],
    [
      'correctly parse a `mailto`-style URI',
      'mailto:someone@example.com',
      {
        scheme: 'mailto',
        path: 'someone@example.com',
      },
    ],
    [
      'correctly parse a `mailto`-style URI with query string',
      'mailto:someone@example.com?subject=Test&body=Some+body',
      {
        scheme: 'mailto',
        path: 'someone@example.com',
        query: 'subject=Test&body=Some+body',
      },
    ],
    [
      'correctly parse a `mailto`-style URI with multiple receivers',
      'mailto:someone@example.com,someoneelse@example.com?subject=Test&body=Some+body',
      {
        scheme: 'mailto',
        path: 'someone@example.com,someoneelse@example.com',
        query: 'subject=Test&body=Some+body',
      },
    ],
    [
      'correctly parse a ISBN URN',
      'urn:isbn:978-3-16-148410-0',
      {
        scheme: 'urn',
        path: 'isbn:978-3-16-148410-0',
      },
    ],
    [
      'correctly parse a websocket URI',
      'ws://example.com/some-path?q=1#test',
      {
        scheme: 'ws',
        host: 'example.com',
        path: '/some-path',
        query: 'q=1',
        fragment: 'test',
      },
    ],
    [
      'correctly parse a secure websocket URI',
      'wss://example.com/some-path?q=1#test',
      {
        scheme: 'wss',
        host: 'example.com',
        path: '/some-path',
        query: 'q=1',
        fragment: 'test',
      },
    ],
    [
      'correctly parse a UUID URN',
      'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      {
        scheme: 'urn',
        path: 'uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
      },
    ],
    [
      'correctly parse a slash path',
      'https://example.com/',
      {
        scheme: 'https',
        host: 'example.com',
        path: '/',
      },
    ],
    [
      'correctly parse an empty path',
      'https://example.com',
      {
        scheme: 'https',
        host: 'example.com',
      },
    ],
  ]).it('should %s', (_, uriString, expected) => {
    expect(parse(uriString)).toEqual(expected)
  })
})
