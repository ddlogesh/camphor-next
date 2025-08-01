export const SQLITE_OK = 0;
export const SQLITE_ERROR = 1;
export const SQLITE_INTERNAL = 2;
export const SQLITE_PERM = 3;
export const SQLITE_ABORT = 4;
export const SQLITE_BUSY = 5;
export const SQLITE_LOCKED = 6;
export const SQLITE_NOMEM = 7;
export const SQLITE_READONLY = 8;
export const SQLITE_INTERRUPT = 9;
export const SQLITE_IOERR = 10;
export const SQLITE_CORRUPT = 11;
export const SQLITE_NOTFOUND = 12;
export const SQLITE_FULL = 13;
export const SQLITE_CANTOPEN = 14;
export const SQLITE_PROTOCOL = 15;
export const SQLITE_EMPTY = 16;
export const SQLITE_SCHEMA = 17;
export const SQLITE_TOOBIG = 18;
export const SQLITE_CONSTRAINT = 19;
export const SQLITE_MISMATCH = 20;
export const SQLITE_MISUSE = 21;
export const SQLITE_NOLFS = 22;
export const SQLITE_AUTH = 23;
export const SQLITE_FORMAT = 24;
export const SQLITE_RANGE = 25;
export const SQLITE_NOTADB = 26;
export const SQLITE_NOTICE = 27;
export const SQLITE_WARNING = 28;
export const SQLITE_ROW = 100;
export const SQLITE_DONE = 101;

// Extended error codes.
export const SQLITE_IOERR_ACCESS = 3338;
export const SQLITE_IOERR_CHECKRESERVEDLOCK = 3594;
export const SQLITE_IOERR_CLOSE = 4106;
export const SQLITE_IOERR_DATA = 8202;
export const SQLITE_IOERR_DELETE = 2570;
export const SQLITE_IOERR_DELETE_NOENT = 5898;
export const SQLITE_IOERR_DIR_FSYNC = 1290;
export const SQLITE_IOERR_FSTAT = 1802;
export const SQLITE_IOERR_FSYNC = 1034;
export const SQLITE_IOERR_GETTEMPPATH = 6410;
export const SQLITE_IOERR_LOCK = 3850;
export const SQLITE_IOERR_NOMEM = 3082;
export const SQLITE_IOERR_READ = 266;
export const SQLITE_IOERR_RDLOCK = 2314;
export const SQLITE_IOERR_SEEK = 5642;
export const SQLITE_IOERR_SHORT_READ = 522;
export const SQLITE_IOERR_TRUNCATE = 1546;
export const SQLITE_IOERR_UNLOCK = 2058;
export const SQLITE_IOERR_VNODE = 6922;
export const SQLITE_IOERR_WRITE = 778;
export const SQLITE_IOERR_BEGIN_ATOMIC = 7434;
export const SQLITE_IOERR_COMMIT_ATOMIC = 7690;
export const SQLITE_IOERR_ROLLBACK_ATOMIC = 7946;

// Other extended result codes.
export const SQLITE_CONSTRAINT_CHECK = 275;
export const SQLITE_CONSTRAINT_COMMITHOOK = 531;
export const SQLITE_CONSTRAINT_FOREIGNKEY = 787;
export const SQLITE_CONSTRAINT_FUNCTION = 1043;
export const SQLITE_CONSTRAINT_NOTNULL = 1299;
export const SQLITE_CONSTRAINT_PINNED = 2835;
export const SQLITE_CONSTRAINT_PRIMARYKEY = 1555;
export const SQLITE_CONSTRAINT_ROWID = 2579;
export const SQLITE_CONSTRAINT_TRIGGER = 1811;
export const SQLITE_CONSTRAINT_UNIQUE = 2067;
export const SQLITE_CONSTRAINT_VTAB = 2323;

// Open flags.
export const SQLITE_OPEN_READONLY = 0x00000001;
export const SQLITE_OPEN_READWRITE = 0x00000002;
export const SQLITE_OPEN_CREATE = 0x00000004;
export const SQLITE_OPEN_DELETEONCLOSE = 0x00000008;
export const SQLITE_OPEN_EXCLUSIVE = 0x00000010;
export const SQLITE_OPEN_AUTOPROXY = 0x00000020;
export const SQLITE_OPEN_URI = 0x00000040;
export const SQLITE_OPEN_MEMORY = 0x00000080;
export const SQLITE_OPEN_MAIN_DB = 0x00000100;
export const SQLITE_OPEN_TEMP_DB = 0x00000200;
export const SQLITE_OPEN_TRANSIENT_DB = 0x00000400;
export const SQLITE_OPEN_MAIN_JOURNAL = 0x00000800;
export const SQLITE_OPEN_TEMP_JOURNAL = 0x00001000;
export const SQLITE_OPEN_SUBJOURNAL = 0x00002000;
export const SQLITE_OPEN_SUPER_JOURNAL = 0x00004000;
export const SQLITE_OPEN_NOMUTEX = 0x00008000;
export const SQLITE_OPEN_FULLMUTEX = 0x00010000;
export const SQLITE_OPEN_SHAREDCACHE = 0x00020000;
export const SQLITE_OPEN_PRIVATECACHE = 0x00040000;
export const SQLITE_OPEN_WAL = 0x00080000;
export const SQLITE_OPEN_NOFOLLOW = 0x01000000;

// Locking levels.
export const SQLITE_LOCK_NONE = 0;
export const SQLITE_LOCK_SHARED = 1;
export const SQLITE_LOCK_RESERVED = 2;
export const SQLITE_LOCK_PENDING = 3;
export const SQLITE_LOCK_EXCLUSIVE = 4;

// Device characteristics.
// https://www.sqlite.org/c3ref/c_iocap_atomic.html
export const SQLITE_IOCAP_ATOMIC = 0x00000001;
export const SQLITE_IOCAP_ATOMIC512 = 0x00000002;
export const SQLITE_IOCAP_ATOMIC1K = 0x00000004;
export const SQLITE_IOCAP_ATOMIC2K = 0x00000008;
export const SQLITE_IOCAP_ATOMIC4K = 0x00000010;
export const SQLITE_IOCAP_ATOMIC8K = 0x00000020;
export const SQLITE_IOCAP_ATOMIC16K = 0x00000040;
export const SQLITE_IOCAP_ATOMIC32K = 0x00000080;
export const SQLITE_IOCAP_ATOMIC64K = 0x00000100;
export const SQLITE_IOCAP_SAFE_APPEND = 0x00000200;
export const SQLITE_IOCAP_SEQUENTIAL = 0x00000400;
export const SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN = 0x00000800;
export const SQLITE_IOCAP_POWERSAFE_OVERWRITE = 0x00001000;
export const SQLITE_IOCAP_IMMUTABLE = 0x00002000;
export const SQLITE_IOCAP_BATCH_ATOMIC = 0x00004000;

// xAccess flags.
export const SQLITE_ACCESS_EXISTS = 0;
export const SQLITE_ACCESS_READWRITE = 1;
export const SQLITE_ACCESS_READ = 2;

// Fundamental datatypes.
export const SQLITE_INTEGER = 1;
export const SQLITE_FLOAT = 2;
export const SQLITE_TEXT = 3;
export const SQLITE_BLOB = 4;
export const SQLITE_NULL = 5;

// Text encodings.
export const SQLITE_UTF8 = 1;     /* IMP: R-37514-35566 */
export const SQLITE_UTF16LE = 2;  /* IMP: R-03371-37637 */
export const SQLITE_UTF16BE = 3;  /* IMP: R-51971-34154 */
export const SQLITE_UTF16 = 4;    /* Use native byte order */

// Sync flags
export const SQLITE_SYNC_NORMAL   = 0x00002;
export const SQLITE_SYNC_FULL     = 0x00003;
export const SQLITE_SYNC_DATAONLY = 0x00010;
