export interface NamespaceMessage {
  id: number;
  height: number;
  time: string;
  position?: number;
  type: string;
  data?: {
    BlobSizes?: number[];
    Namespaces?: string[];
    ShareCommitments?: string[];
    ShareVersions?: number[];
    Signer?: string;
  };
  tx?: {
    id: number;
    height: number;
    position: number;
    gas_wanted: number;
    gas_used: number;
    timeout_height: number;
    events_count: number;
    messages_count: number;
    hash: string;
    fee: string;
    time: string;
    message_types: string[];
    status: string;
  };
  namespace: {
    id: number;
    size: number;
    blobs_count: number;
    version: number;
    namespace_id: string;
    hash: string;
    pfb_count: number;
    last_height: number;
    last_message_time: string;
    name: string;
    reserved: boolean;
  };
  commitment?: string;
  version?: number;
  size?: number;
}

export interface NamespaceInfo {
  id: number;
  size: number;
  blobs_count: number;
  version: number;
  namespace_id: string;
  hash: string;
  pfb_count: number;
  last_height: number;
  last_message_time: string;
  name: string;
  reserved: boolean;
}

export interface RollupInfo {
  id: number;
  name: string;
  description?: string;
  website: string;
  twitter: string;
  github?: string;
  logo?: string;
  slug?: string;
  l2_beat?: string;
  defi_lama?: string;
  explorer?: string;
  stack?: string;
  type?: string;
  category?: string;
  vm?: string;
  tags?: string[];
  links?: string[];
  namespace_id?: string;
}

export interface HealthMetrics {
  pfbRatio: number;
  activityRatio: number;
  messageFrequency: number;
  versionConsistency: number;
  sizeStability: number;
}

export interface HistoricalHealth {
  timestamp: string;
  healthScore: number;
  metrics: HealthMetrics;
}