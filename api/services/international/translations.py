def get_text_by_locale(
        locale: str,
) -> dict[str, str]:
    """
    Return object of messages by locale

    :param locale: Locale
    :type locale: str

    :return: 
    :rtype: str
    """
    if locale == "pt-br":
        from api.translations.pt_br import (
            MESSAGE_HEADER,
            MESSAGE_SUBHEADER,
            BUTTON_VALUE,
            POWERED_BY,
            POWERED_BY_LINK,
            MESSAGE_HEADER_SHARED,
            MESSAGE_SUBHEADER_SHARED,
            MESSAGE_CLICK_TO_COPY_US_US,
            MESSAGE_CLICK_TO_COPY_PT_BR,
            MESSAGE_CLICK_TO_COPY_ES_ES ,           
        )
    elif locale == "es-es":
        from api.translations.es_es import (
            MESSAGE_HEADER,
            MESSAGE_SUBHEADER,
            BUTTON_VALUE,
            POWERED_BY,
            POWERED_BY_LINK,
            MESSAGE_HEADER_SHARED,
            MESSAGE_SUBHEADER_SHARED,
            MESSAGE_CLICK_TO_COPY_US_US,
            MESSAGE_CLICK_TO_COPY_PT_BR,
            MESSAGE_CLICK_TO_COPY_ES_ES ,     
        )
    else:
        from api.translations.en_us import (
            MESSAGE_HEADER,
            MESSAGE_SUBHEADER,
            BUTTON_VALUE,
            POWERED_BY,
            POWERED_BY_LINK,
            MESSAGE_HEADER_SHARED,
            MESSAGE_SUBHEADER_SHARED,
            MESSAGE_CLICK_TO_COPY_US_US,
            MESSAGE_CLICK_TO_COPY_PT_BR,
            MESSAGE_CLICK_TO_COPY_ES_ES ,     
        )                
    return {
        "message_header": MESSAGE_HEADER,
        "message_subheader": MESSAGE_SUBHEADER,
        "button_value": BUTTON_VALUE,
        "powered_by": POWERED_BY,
        "powered_by_link": POWERED_BY_LINK,
        "message_header_shared": MESSAGE_HEADER_SHARED,
        "message_subheader_shared": MESSAGE_SUBHEADER_SHARED,
        "message_click_to_copy_us_us": MESSAGE_CLICK_TO_COPY_US_US,
        "message_click_to_copy_pt_br": MESSAGE_CLICK_TO_COPY_PT_BR,
        "message_click_to_copy_es_es": MESSAGE_CLICK_TO_COPY_ES_ES ,          
    }
