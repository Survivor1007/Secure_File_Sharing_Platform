import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'audit.log');

export const auditLog = async (action:string, userId: string | null, details: any = {}) => {
      try{
            if(!fs.existsSync(LOG_DIR)){
                  fs.mkdirSync(LOG_DIR, {recursive:true} );
            }

            const logEntry = {
                  timestamp : new Date().toISOString,
                  action,
                  userId,
                  ip: details.ip || null,
                  ...details
            };

            const logLine = JSON.stringify(logEntry) + '\n';

            await fs.promises.appendFile(LOG_FILE, logLine);
            console.log(`[ACTION] ${action} by user ${userId || 'anonymous'}`);
      }catch(err){
            console.error('Failed to write log audit:', err);
      }
};