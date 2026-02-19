import os from "node:os";

export function getStat(): Statistics {
  const uptime = Math.round(process.uptime() * 1_000);
  return {
    cpu: process.cpuUsage(),
    memory: process.memoryUsage(),
    time: { uptime, startedAt: Date.now() - uptime },
    npm: { pwd: process.env.PWD, version: process.env.npm_config_npm_version },
    node: { type: "module", version: process.env.npm_config_node_version },
    project: {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
      log: process.env.LOG_LEVEL,
    },
    os: {
      version: os.version(),
      arch: os.arch(),
      platform: os.platform(),
      machineType: os.machine(),
      network: os.networkInterfaces(),
      cpu: os.cpus(),
    },
  };
}

export interface Statistics {
  cpu: StatisticsCpu;
  memory: StatisticsMemory;
  time: StatisticsTime;
  npm: StatisticsNpm;
  node: StatisticsNode;
  project: StatisticsProject;
  os: StatisticsOs;
}

export interface StatisticsCpu {
  user: number;
  system: number;
}
export interface StatisticsTime {
  uptime: number;
  startedAt: number;
}
export interface StatisticsNpm {
  pwd: string;
  version: string;
}
export interface StatisticsNode {
  type: string;
  version: string;
}
export interface StatisticsProject {
  name: string;
  version: string;
  environment: string;
  log: string;
}
export interface StatisticsOs {
  version: string;
  arch: string;
  platform: string;
  machineType: string;
  network: Record<string, unknown>;
  cpu: Array<StatisticsCpuInfo>;
}
export interface StatisticsMemory {
  /**
   * Resident Set Size, is the amount of space occupied in the main memory device (that is a subset of the total allocated memory) for the
   * process, including all C++ and JavaScript objects and code.
   */
  rss: number;
  /**
   * Refers to V8's memory usage.
   */
  heapTotal: number;
  /**
   * Refers to V8's memory usage.
   */
  heapUsed: number;
  external: number;
  /**
   * Refers to memory allocated for `ArrayBuffer`s and `SharedArrayBuffer`s, including all Node.js Buffers. This is also included
   * in the external value. When Node.js is used as an embedded library, this value may be `0` because allocations for `ArrayBuffer`s
   * may not be tracked in that case.
   */
  arrayBuffers: number;
}

export interface StatisticsCpuInfo {
  model: string;
  speed: number;
  times: {
    /** The number of milliseconds the CPU has spent in user mode. */
    user: number;
    /** The number of milliseconds the CPU has spent in nice mode. */
    nice: number;
    /** The number of milliseconds the CPU has spent in sys mode. */
    sys: number;
    /** The number of milliseconds the CPU has spent in idle mode. */
    idle: number;
    /** The number of milliseconds the CPU has spent in irq mode. */
    irq: number;
  };
}
