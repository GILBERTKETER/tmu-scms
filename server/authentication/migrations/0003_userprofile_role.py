# Generated by Django 5.0.6 on 2024-10-30 05:26

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("authentication", "0002_userprofile_full_name_userprofile_program_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="role",
            field=models.CharField(
                blank=True, default="student", max_length=100, null=True
            ),
        ),
    ]
