// Vercel Serverless Function for Stock Data
// BSE API aur TwelveData API ko server-side se call karta hai (CORS bypass)

import type { VercelRequest, VercelResponse } from '@vercel/node';

const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY || '4049c8eebfd744959155f76559bb50a4';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers set karo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight request handle karo
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // TwelveData API se data fetch karo
    const url = `https://api.twelvedata.com/time_series?symbol=COLAB.BSE&interval=1day&apikey=${TWELVEDATA_API_KEY}&outputsize=2`;
    
    console.log('📊 Fetching from TwelveData API...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TwelveData API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Error check karo
    if (data.status === 'error' || data.code) {
      throw new Error(data.message || 'API error');
    }
    
    // Valid data check karo
    if (!data.values || data.values.length === 0) {
      throw new Error('No data available');
    }
    
    // Latest data point nikalo
    const latest = data.values[0];
    const currentPrice = parseFloat(latest.close);
    const open = parseFloat(latest.open);
    const high = parseFloat(latest.high);
    const low = parseFloat(latest.low);
    const volume = parseInt(latest.volume || 0);
    
    // Change calculate karo
    let previousClose = currentPrice;
    let change = 0;
    let changePercent = 0;
    
    if (data.values.length > 1) {
      previousClose = parseFloat(data.values[1].close);
      change = currentPrice - previousClose;
      changePercent = (change / previousClose) * 100;
    }
    
    // Market timing check karo (IST)
    const istTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    const day = istTime.getDay();
    
    const isMarketHours = 
      day >= 1 && day <= 5 &&
      ((hour === 9 && minute >= 15) || (hour > 9 && hour < 15) || (hour === 15 && minute <= 30));
    
    const stockData = {
      symbol: 'BSE: 542866',
      companyName: 'Colab Platforms Ltd',
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: volume,
      lastUpdated: latest.datetime || new Date().toISOString(),
      status: isMarketHours ? 'open' : 'closed',
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      previousClose: parseFloat(previousClose.toFixed(2))
    };
    
    console.log('✅ Stock data ready:', stockData);
    
    return res.status(200).json(stockData);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    // Fallback data return karo
    return res.status(200).json({
      symbol: 'BSE: 542866',
      companyName: 'Colab Platforms Ltd',
      currentPrice: 194.70  ,
      change:  -1.95,
      changePercent: -0.99,
      volume:52000,
      lastUpdated: new Date().toISOString(),
      status: 'closed',
      high: 194.70,
      low: 194.70,
      open: 194.70,
      previousClose: 196.65,
      error: error.message
    });
  }
}
