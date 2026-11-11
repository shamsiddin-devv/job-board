# WorkUZ on Oracle Cloud Always Free

Use an Ubuntu ARM64 instance with the Always Free eligible `VM.Standard.A1.Flex` shape in the tenancy's home region. Start with 1 OCPU and 4 GB RAM, a public subnet with an internet gateway, and the default boot volume. Check the Console's eligibility label before creating it. Free shape capacity can be unavailable, and Oracle may reclaim idle instances. [Oracle Always Free limits](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)

1. In OCI, add the public SSH key during instance creation. In the instance network security group and the host firewall, allow inbound TCP 80 and 443. Allow SSH on TCP 22 only from the address you use to administer the VPS. On Ubuntu, the SSH user is `ubuntu`. [Oracle instance setup](https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/launchinginstance.htm)
2. Point a DNS name at the VM's public IPv4. A free DuckDNS subdomain is sufficient for the API. Caddy obtains and renews the certificate when the name resolves to the VPS and ports 80 and 443 are reachable. [DuckDNS](https://www.duckdns.org/why.jsp), [Caddy HTTPS](https://caddyserver.com/docs/automatic-https)
3. Install Docker Engine and its Compose plugin using the official Ubuntu instructions. Transfer the reviewed local WorkUZ checkout to the VPS, or clone a Git branch that contains the deployment changes. [Docker installation](https://docs.docker.com/engine/install/ubuntu/)
4. In the WorkUZ checkout on the VPS, create the private environment file.

   ```sh
   install -m 600 .env.vps.example .env.vps
   ```

   Edit `.env.vps` on the server. Set the DNS hostname and replace the four secret placeholders with separately generated values from `openssl rand -hex 32`. Configure SMTP, Cloudinary, and the Google/GitHub OAuth clients with the HTTPS callback URLs shown in the template. Enter real credentials only in the server environment. Set `FRONTEND_URL` to the HTTPS API origin until there is a frontend. Browser login and OAuth completion require the actual frontend and callback pages. Host that frontend at the same origin or on a same-site hostname when it is available.

5. Validate the configuration, build the images, apply database migrations, and then start the API and proxy. Run these commands as a user authorized to access Docker.

   ```sh
   docker compose --env-file .env.vps -f compose.vps.yml config --quiet
   docker compose --env-file .env.vps -f compose.vps.yml build backend migrate
   docker compose --env-file .env.vps -f compose.vps.yml up -d --wait postgres redis
   docker compose --env-file .env.vps -f compose.vps.yml run --rm migrate
   docker compose --env-file .env.vps -f compose.vps.yml up -d --wait backend proxy
   ```

   This provisions a new empty database. To carry over existing data, take a backup and follow the [production migration guidance](../README.md#production-rollout) before exposing the API.

6. From outside the VPS, check `https://YOUR_HOST/api/health/live` and `https://YOUR_HOST/api/health/ready`. Both should return HTTP 200. Test OTP email and a file upload before inviting users. Test browser OAuth once the frontend is online.

Back up PostgreSQL to a location outside the VPS. A local volume survives container replacement but does not protect against loss of the VM. Keep the same PostgreSQL password in the environment when updating an existing volume. Rotate it in PostgreSQL as well when changing it later.
