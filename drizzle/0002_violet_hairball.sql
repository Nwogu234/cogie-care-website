CREATE TABLE `admin_invites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(100) NOT NULL,
	`email` varchar(320),
	`label` varchar(200),
	`createdById` int NOT NULL,
	`used` boolean NOT NULL DEFAULT false,
	`usedById` int,
	`usedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_invites_token_unique` UNIQUE(`token`)
);
