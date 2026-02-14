import type { Request, Response, NextFunction } from 'express';


export default {
  
  logRequest(req: Request, res: Response, next: NextFunction) {
    let output  = `\nRequest received\n-------------\n`;
    output += `Method: ${req.method}\n`;
    output += `From: ${req.url}\n`;
    output += `Headers: ${req.header('Authorization')}\n`;
    output += `Body: ${JSON.stringify(req.body)}\n`;
    console.log(output);

    res.on('finish', () => {
      let output = `\nResponse sent\n-------------\n`;
      output += `${res.statusCode}: ${res.statusMessage}\n`;
      console.log(output);
    });

    res.on('end', () => {
      let output = `\nResponse sent\n-------------\n`;
      output += `${res.statusCode}: ${res.statusMessage}\n`;
      console.log(output);
    });

    res.on('error', () => {
      let output = `\Error\n-------------\n`;
      output += `${res.statusCode}: ${res.statusMessage}\n`;
      console.log(output);
    });

    next();
  }
};