import cron from 'node-cron';

import * as db from '../modules/db.js';
import * as file from '../modules/file.js';

//Based on https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples
//Cron syntax provided by https://www.digitalocean.com/community/tutorials/how-to-use-cron-to-automate-tasks-on-a-vps

function timeDateString() { 
    return new Date(Date.now()).toString(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
}

cron.schedule('*/4 * * * *', () => {
    console.log('%s - Expired secret operation started.', timeDateString());
    var expiredSecrets = db.showExpiredSecrets(); //Get iterator with a list of secrets.
    var deletedFileCount;
    var deletedRowCount;
    try { //Remove the secret files first
        if (!expiredSecrets.success) {
            throw err = expiredSecrets.error; //Throw an error if it is n ot possible to read expired secrets,f or some reason (may need to set up variable properly)
        }
        for (const secret in expiredSecrets) { 
            var deletedFiles = file.deleteSecret(secret);
            if (!deletedFiles.success) {
                throw deletedFiles.error;
            }
            deletedFileCount += deletedFiles.deleted_file_count; //Remove conditionally if file counts are over MAXINT
        }

        var deletedRows = db.purgeExpiredSecrets(); //Remove from database
        if (!deletedRows.success) {
            throw deletedRows.error;
        }
        deletedRowCount = deletedRows.data; //Remove conditionally if row counts are over MAXINT
    }
    catch (err) {
        console.error('%s - Purge operation failed.', timeDateString());
        console.error("Could not delete secrets: %s", err);
    }
    finally {
        console.log('%s - Purge operation completed succesfully.', timeDateString())
        console.log('%d expired secrets removed from database.', deletedRowCount);
        console.log('%d secret files deleted.', deletedFileCount);
    }
});