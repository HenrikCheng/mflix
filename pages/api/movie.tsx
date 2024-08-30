import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		// Get the movieId from the request query or body
		const { movieId } = req.query; // assuming movieId is passed as a query parameter
		if (!movieId || typeof movieId !== "string") {
			res
				.status(400)
				.json({ error: "movieId is required and should be a string" });
			return;
		}

		const client = await clientPromise;
		const db = client.db("sample_mflix");
		const movies = await db
			.collection("movies")
			.find({ _id: new ObjectId(movieId) })
			.sort({ metacritic: -1 })
			.limit(10)
			.toArray();
		res.json(movies);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
