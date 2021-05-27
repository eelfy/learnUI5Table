using {cuid, managed} from '@sap/cds/common';

namespace sap.fe.test;

service JestService {
    @odata.draft.enabled
    entity Items {
         key ID : UUID;
    }
}