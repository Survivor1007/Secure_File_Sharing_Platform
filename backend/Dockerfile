#===========================
# STAGE 1 : Builder stage
#===========================

#use node version 20,alpine linux distribution, it is a multi stage builder
FROM node:20-alpine AS builder

#make a container to do the work
WORKDIR app/

RUN apk add --no-cache openssl

#copy the package files
COPY package*.json ./

#this install dependencies that are only needed in production
RUN npm ci 

# copy the source code from backend to the working dir app
COPY . . 

#Generate Prisma client
RUN npx prisma generate

#Build typescript
RUN npm run build

#====================================
# STAGE 2:The production Phase
#====================================
#Create a new container
FROM node:20-alpine

#Working directory
WORKDIR app/

RUN apk add --no-cache openssl

#Copy the compiled files from the builder /app into this new contianer
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma


#Create the uploads folder 
RUN mkdir -p uploads prisma/migrations && \
 chown -R node:node /app && \
 chmod -R 755 prisma

USER node

#Listen to port 5000
EXPOSE 5000

#run the server 
CMD ["node","./dist/server.js" ]


