"""
Provides a logger factory to create all
the loggers used by the application.
"""
import os
import logging
import datetime
import pathlib
from logging.handlers import TimedRotatingFileHandler
from flask import request, session, has_request_context

LOGS_FOLDER: str = os.getenv("LOGS_FOLDER") or f"{os.getcwd()}/logs/"


class UserDataFilter(logging.Filter):
    """
    Custom filter for including user's data
    Appends some default values to the log record if a HTTP request is available.
    For example, the user's email and request origin.
    """

    def return_request_data(self) -> dict:
        """
        Returns some extra information from an active HTTP request
        to include in the log record.

        Returns:
            dict: Extra information retrieved from request headers and
                current active session. If there is no active HTTP context
                an dictionary with default values will be returned.
        """
        extra_data: dict = {"origin": "<unknown>", "email": "<unknown>"}
        if has_request_context():
            request_origin = request.remote_addr
            email = session.get("user", {}).get("email")
            extra_data["origin"] = request_origin
            extra_data["email"] = email
        return extra_data

    def fill_remaining(self, record: logging.LogRecord) -> logging.LogRecord:
        extra_data: dict = self.return_request_data()
        origin: str = extra_data.get("origin")
        email: str = extra_data.get("email")
        if not hasattr(record, "email"):
            record.email = email
        if not hasattr(record, "origin"):
            record.origin = origin
        return record

    def filter(self, record: logging.LogRecord):
        record = self.fill_remaining(record=record)
        return True


class LoggerManager:
    """
    Creates and sets a custom logger to record events related to
    AuthenticationMiddleware and store them into files

    Attributes:
        logger_format (logging.Formatter): Formatter to install
            to all logger handlers.
        name (str): Logger name
        logger (logging.Logger): Main logger configured to record events.
        level (int): Logger's level.
        handlers (logging.Handlers): Handlers installed for the logger.
    """

    def __init__(self, name: str, level: int = logging.INFO) -> None:
        self.name: str = name
        self.level: int = level
        self.__format: str = "[%(origin)s][%(levelname)s][%(filename)s:%(lineno)s][%(email)s][%(asctime)s]: %(message)s"
        self.__date_format: str = "%Y-%m-%d %H:%M:%S %z"
        self.logger_format: logging.Formatter = logging.Formatter(
            fmt=self.__format, datefmt=self.__date_format
        )
        self.handlers: list[logging.Handler] = []
        self.__logger: logging.Logger = self.__build_logger()

    def __build_logger(self) -> logging.Logger:
        """
        Creates the logger and configures all the handlers

        Returns:
            logging.Logger: Logger with all the handlers and filters configured
        """
        # Configure the logger
        logger: logging.Logger = logging.getLogger(self.name)
        logger.setLevel(level=self.level)

        # Instantiate the handlers
        console_handler: logging.Handler = self.__create_console_logger(
            filter=UserDataFilter()
        )
        file_handler: logging.Handler = self.__create_file_handler(
            filename=f"{self.name}.log", filter=UserDataFilter()
        )
        self.handlers = [console_handler, file_handler]

        # Install the handlers into the logger
        logger.handlers.clear()
        for handler in self.handlers:
            logger.addHandler(hdlr=handler)

        return logger

    def __create_file_handler(
        self, filename: str, filter: logging.Filter | None = None
    ) -> TimedRotatingFileHandler:
        """
        Creates a file handler to store log records into the filesystem.
        """
        # Rotate the file at midnight
        file_rollover_interval: datetime.time = datetime.time(
            hour=0, minute=0, second=0
        )
        log_folder: pathlib.Path = pathlib.Path(LOGS_FOLDER)
        log_folder.mkdir(exist_ok=True)
        time_fs_handler: TimedRotatingFileHandler = TimedRotatingFileHandler(
            filename=log_folder.joinpath(filename),
            when="midnight",
            encoding="utf-8",
            atTime=file_rollover_interval,
            backupCount=60,
        )

        # Set logger level
        time_fs_handler.setLevel(level=self.level)
        time_fs_handler.setFormatter(fmt=self.logger_format)
        if filter:
            time_fs_handler.addFilter(filter=filter)
        return time_fs_handler

    def __create_console_logger(
        self, filter: logging.Filter | None = None
    ) -> logging.StreamHandler:
        """
        Creates and configures a handler to log messages into the console.
        """
        console_handler: logging.StreamHandler = logging.StreamHandler()
        console_handler.setLevel(level=self.level)
        console_handler.setFormatter(fmt=self.logger_format)
        if filter:
            console_handler.addFilter(filter=filter)
        return console_handler

    @property
    def logger(self) -> logging.Logger:
        """
        Return the created logger
        """
        return self.__logger


# API logger
api_logger: logging.Logger = LoggerManager(name="api").logger
