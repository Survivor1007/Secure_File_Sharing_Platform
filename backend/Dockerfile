#===========================
# STAGE 1 : Builder stage
#===========================

#use node version 20,alpine linux distribution, it is a multi stage builder
FROM node:20-alpine AS builder

#make a container to do the work
WORKDIR app/

#copy the package files
COPY package*.json ./

#this install dependencies that are only needed in production
RUN npm ci --only-production

# copy the source code from backend to the working dir app
COPY . . 

#Build typescript
RUN npm run build

#====================================
# STAGE 2:The production Phase
#====================================
#Create a new container
FROM node:20-alpine

#Working directory
WORKDIR app/

#Copy the compiled files from the builder /app into this new contianer
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./


#Create the uploads folder 
RUN mkdir -p uploads && chown -R node:node uploads

USER node

#Listen to port 5000
EXPOSE 5000

#run the server 
CMD ["node","./dist/server.js" ]


