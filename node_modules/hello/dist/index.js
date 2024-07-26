"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.ts
var lib_exports = {};
__export(lib_exports, {
  getGithubProfile: () => getGithubProfile,
  githubUserSchema: () => githubUserSchema,
  hello: () => hello
});
module.exports = __toCommonJS(lib_exports);

// lib/schemas.ts
var import_zod = require("zod");
var githubUserSchema = import_zod.z.object({
  login: import_zod.z.string(),
  id: import_zod.z.number(),
  node_id: import_zod.z.string(),
  avatar_url: import_zod.z.string().url(),
  gravatar_id: import_zod.z.nullable(import_zod.z.string()),
  url: import_zod.z.string().url(),
  html_url: import_zod.z.string().url(),
  followers_url: import_zod.z.string().url(),
  following_url: import_zod.z.string(),
  gists_url: import_zod.z.string(),
  starred_url: import_zod.z.string(),
  subscriptions_url: import_zod.z.string().url(),
  organizations_url: import_zod.z.string().url(),
  repos_url: import_zod.z.string().url(),
  events_url: import_zod.z.string(),
  received_events_url: import_zod.z.string().url(),
  type: import_zod.z.string(),
  site_admin: import_zod.z.boolean(),
  name: import_zod.z.nullable(import_zod.z.string()),
  company: import_zod.z.nullable(import_zod.z.string()),
  blog: import_zod.z.nullable(import_zod.z.string()),
  location: import_zod.z.nullable(import_zod.z.string()),
  email: import_zod.z.nullable(import_zod.z.string().email()).optional(),
  hireable: import_zod.z.nullable(import_zod.z.boolean()),
  bio: import_zod.z.nullable(import_zod.z.string()),
  twitter_username: import_zod.z.nullable(import_zod.z.string()),
  public_repos: import_zod.z.number(),
  public_gists: import_zod.z.number(),
  followers: import_zod.z.number(),
  following: import_zod.z.number(),
  created_at: import_zod.z.coerce.date(),
  updated_at: import_zod.z.coerce.date(),
  private_gists: import_zod.z.number().optional(),
  total_private_repos: import_zod.z.number().optional(),
  owned_private_repos: import_zod.z.number().optional(),
  disk_usage: import_zod.z.number().optional(),
  collaborators: import_zod.z.number().optional()
});

// lib/hello.ts
async function getGithubProfile(username) {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  return githubUserSchema.parse(await res.json());
}
async function hello(username) {
  const profile = await getGithubProfile(username);
  return {
    profile
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getGithubProfile,
  githubUserSchema,
  hello
});
