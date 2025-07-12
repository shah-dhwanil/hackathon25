from cms.utils.exceptions import CMSException


class QuestionNotFoundException(CMSException):
    slug = "question_not_found"
    description = "The requested user does not exist."

    def __init__(self, parameter: str, **kwargs):
        super().__init__(context={"parameter": parameter, **kwargs})