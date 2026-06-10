CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobPostingId` int,
	`applicantName` varchar(300) NOT NULL,
	`applicantEmail` varchar(320) NOT NULL,
	`positionApplied` varchar(300),
	`phone` varchar(50),
	`formData` json NOT NULL,
	`status` enum('new','reviewing','shortlisted','interviewed','offered','rejected','withdrawn') NOT NULL DEFAULT 'new',
	`notes` text,
	`emailSent` boolean NOT NULL DEFAULT false,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_postings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(200) NOT NULL,
	`title` varchar(300) NOT NULL,
	`department` varchar(200),
	`location` varchar(300),
	`employmentType` varchar(100),
	`salary` varchar(200),
	`rawInput` text,
	`description` text NOT NULL,
	`summary` text,
	`responsibilities` json,
	`requirements` json,
	`benefits` json,
	`howToApply` text,
	`closingDate` timestamp,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdById` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_postings_id` PRIMARY KEY(`id`),
	CONSTRAINT `job_postings_slug_unique` UNIQUE(`slug`)
);
