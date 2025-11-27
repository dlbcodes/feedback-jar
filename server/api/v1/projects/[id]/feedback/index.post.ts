import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
	return true
});