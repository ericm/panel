<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $server_id
 * @property int $uuid
 * @property string $name
 * @property string[] $ignored_files
 * @property string $disk
 * @property string|null $sha256_hash
 * @property int $bytes
 * @property \Carbon\CarbonImmutable|null $completed_at
 * @property \Carbon\CarbonImmutable $created_at
 * @property \Carbon\CarbonImmutable $updated_at
 * @property \Carbon\CarbonImmutable|null $deleted_at
 *
 * @property \Pterodactyl\Models\Server $server
 */
class Backup extends Model
{
    use SoftDeletes;

    const RESOURCE_NAME = 'backup';

    const DISK_LOCAL = 'local';
    const DISK_AWS_S3 = 's3';

    /**
     * @var string
     */
    protected $table = 'backups';

    /**
     * @var bool
     */
    protected $immutableDates = true;

    /**
     * @var array
     */
    protected $casts = [
        'id' => 'int',
        'bytes' => 'int',
        'ignored_files' => 'array',
    ];

    /**
     * @var array
     */
    protected $dates = [
        'completed_at',
    ];

    /**
     * @var array
     */
    protected $attributes = [
        'sha256_hash' => null,
        'bytes' => 0,
    ];

    /**
     * @var array
     */
    public static $validationRules = [
        'server_id' => 'bail|required|numeric|exists:servers,id',
        'uuid' => 'required|uuid',
        'name' => 'required|string',
        'ignored_files' => 'array',
        'disk' => 'required|string',
        'sha256_hash' => 'nullable|string',
        'bytes' => 'numeric',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function server()
    {
        return $this->belongsTo(Server::class);
    }
}
