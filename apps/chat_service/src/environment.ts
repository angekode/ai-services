import dotenv from 'dotenv';
import zod, { ZodError } from 'zod';


export default {

  isLoaded: false,

  init() {
    // Environnement
    const envScheme = zod.object({
      PORT : zod.string(),
      PG_DATABASE_URL : zod.url(),
      LLM_PROVIDER : zod.string(),
      LLM_MODEL : zod.string(),
      LLM_KEY : zod.string(),
    });

    dotenv.config();

    try {
      envScheme.parse(process.env);
      this.isLoaded = true;

    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new Error('Fichier de variables d\'environnement invalide:\n' + error.issues.map(issue => `${issue.path} : ${issue.message}`));
      } else {
        throw error;
      }
    }
  }
}
