type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, context?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (this.isDevelopment) {
      const color = {
        info: "\x1b[36m", // Cyan
        warn: "\x1b[33m", // Yellow
        error: "\x1b[31m", // Red
        debug: "\x1b[35m", // Magenta
      }[level];

      console.log(
        `${color}[${entry.level.toUpperCase()}]\x1b[0m ${entry.timestamp}`,
        message,
        context || "",
      );
    }

    // In production, you would send to logging service (e.g., Sentry, LogRocket)
    if (!this.isDevelopment && level === "error") {
      // Send to error tracking service
      this.sendToErrorTracking(entry);
    }
  }

  private sendToErrorTracking(entry: LogEntry) {
    // Implement Sentry or other error tracking
    // Example: Sentry.captureException(new Error(entry.message), { extra: entry.context });
  }

  info(message: string, context?: any) {
    this.log("info", message, context);
  }

  warn(message: string, context?: any) {
    this.log("warn", message, context);
  }

  error(message: string, context?: any) {
    this.log("error", message, context);
  }

  debug(message: string, context?: any) {
    this.log("debug", message, context);
  }
}

export const logger = new Logger();
