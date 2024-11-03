# Generated by Django 5.0.6 on 2024-11-02 04:15

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("threads", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="incident",
            options={"ordering": ["-created_at"]},
        ),
        migrations.AlterModelOptions(
            name="reply",
            options={"ordering": ["created_at"]},
        ),
        migrations.AddField(
            model_name="incident",
            name="avatar",
            field=models.CharField(
                default="https://github.com/gilbertketer.png", max_length=255
            ),
        ),
        migrations.AddField(
            model_name="reply",
            name="avatar",
            field=models.CharField(
                default="https://github.com/gilbertketer.png", max_length=255
            ),
        ),
        migrations.AlterField(
            model_name="incident",
            name="author",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="incident",
            name="id",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, primary_key=True, serialize=False
            ),
        ),
        migrations.AlterField(
            model_name="reply",
            name="author",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="reply",
            name="id",
            field=models.UUIDField(
                default=uuid.uuid4, editable=False, primary_key=True, serialize=False
            ),
        ),
    ]