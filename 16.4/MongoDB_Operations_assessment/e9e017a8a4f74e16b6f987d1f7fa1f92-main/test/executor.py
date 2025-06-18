import re
import json
from collections import OrderedDict
from bson import ObjectId

def parse_json_like_string(json_str):
    json_str = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z_0-9]*)(\s*:)', r'\1"\2"\3', json_str)
    return json_str

def get_formatted_query(query_str):
    json_part_start = query_str.find('(') + 1
    json_part_end = query_str.rfind(')')
    json_part = query_str[json_part_start:json_part_end]
    json_part = parse_json_like_string(json_part)

    json_part = re.sub(r'([{,]\s*)(\$[a-zA-Z_]+)(\s*:)', r'\1"\2"\3', json_part)

    corrected_query_str = query_str[:json_part_start] + json_part + query_str[json_part_end:]

    method_mapping = {
        'insertOne': 'insert_one',
        'updateOne': 'update_one',
        'updateMany': 'update_many',
        'deleteOne': 'delete_one',
        'deleteMany': 'delete_many',
        'findOne': 'find_one',
        'find': 'find'
    }

    for mongo_method, pymongo_method in method_mapping.items():
        corrected_query_str = corrected_query_str.replace(f'.{mongo_method}(', f'.{pymongo_method}(')
    return corrected_query_str

def execute_modification_query(query_str, db):
    corrected_query_str = get_formatted_query(query_str)
    try:
        corrected_query_str = corrected_query_str.replace("false", "False")
        corrected_query_str = corrected_query_str.replace("true", "True")
        exec(corrected_query_str, {"db": db,"ObjectId": ObjectId})
        return True
    except Exception as e:
        print(f"Error executing query: {e}")
        return False

def execute_search_query(query_str, db):
    corrected_query_str = get_formatted_query(query_str)
    try:
        # Manejo especial para sort
        if '.sort(' in corrected_query_str:
            find_part = corrected_query_str.split('.sort(')[0]
            sort_part = corrected_query_str.split('.sort(')[1].rstrip(')')
            sort_args = json.loads(sort_part, object_pairs_hook=OrderedDict)
            sort_args_list = [(k, v) for k, v in sort_args.items()]
            
            find_result = eval(find_part, {"db": db})
            return find_result.sort(sort_args_list)
        else:
            result = eval(corrected_query_str, {"db": db})
            return result
    except Exception as e:
        print(f"Error executing query: {e}")
        return None
